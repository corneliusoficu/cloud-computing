var express = require('express');
var request = require('request');
var util = require('util');
var geo = require('geo-hash');

const TICKETMASTER_API_KEY = "";
const LAST_FM_API_KEY = "";
const GOOGLE_GEOCODING_API_KEY = "";

function convertCoordinatesToGeoHash(coordinates){
    const PRECISION = 9;
    return geo.encode(coordinates.lat, coordinates.lng, PRECISION);
}

function extractArtistInformation(artistName, bodyInfo){

    var artistInformation = {name: '', id: ''};

    if('_embedded' in bodyInfo && 'attractions' in bodyInfo._embedded){
        var attractions = bodyInfo._embedded.attractions;
        for(var i = 0; i < attractions.length; i++){
            if(artistName.toLowerCase() === attractions[i].name.toLowerCase()){
                artistInformation = { name: artistName, id: attractions[i].id };
                break;
            }
        }
    }

    return artistInformation;
}

function extractCoordinates(locationData){
    var coordinates = {lat: '', lng: ''};

    try{

        coordinates.lat = locationData.results[0].geometry.location.lat;
        coordinates.lng = locationData.results[0].geometry.location.lng;

    }catch(e){
        console.log(e);
    }

    return coordinates;

}

function extractEventsInformations(informationObject, nameOfArtist){
    const PRESET_RADIUS = 200;
    var eventsInformations = [];

    try{
        var events = informationObject._embedded.events;

        for(var index = 0; index < events.length; index++){
            var distance = events[index].distance;
            if(distance && distance < PRESET_RADIUS)
            {
                var newEvent = {
                    artist: nameOfArtist,
                    name: events[index].name,
                    date: events[index].dates.start.localDate,
                    hour: events[index].dates.start.localTime,
                    venue: events[index]._embedded.venues[0].name,
                    city: events[index]._embedded.venues[0].city.name,
                    country: events[index]._embedded.venues[0].country.name
                };
                eventsInformations.push(newEvent);
            }
        }

    }catch(e){

    }

    return eventsInformations;
}

function extractArrayOfArtists(jsonData){
    var topArtistsObjectsArray = jsonData.topartists.artist;
    return topArtistsObjectsArray.map(artistObject => artistObject.name);
}

function getEventsForArtists(artistsInformation){
    var geoPoint = artistsInformation[1];
    var artists = artistsInformation[0];
    var ticketMasterEventInformationURL = "https://app.ticketmaster.com/discovery/v2/events.json?attractionId=%s&apikey=%s&geoPoint=%s";

    var ticketMasterEvents = artists.map(function(artist){
        return new Promise(function(resolve, reject){
            const END_POINT = util.format(ticketMasterEventInformationURL, artist.id, TICKETMASTER_API_KEY, geoPoint);
            request.get(END_POINT, function(err, resp, body){
                if(err){
                    reject(err);
                }else{
                    var events = extractEventsInformations(JSON.parse(body), artist.name);
                    resolve(events);
                }
            })
        })
    });

    return Promise.all(ticketMasterEvents).then(function(result){
        var nonEmptyEvents = result.filter(event => event.length > 0);
        const reducer = (accumulator, currentValue) => accumulator.concat(currentValue);
        return nonEmptyEvents.reduce(reducer, []);
    });


}

function getArtistsTicketMasterAttractionIds(artistsNames){
    var TICKET_MASTER_ATTRACTION_ID_API_URL = "https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=%s&keyword=%s";
    var ticketMasterArtistsInformations = artistsNames.map(function(artistName){
        return new Promise(function(resolve, reject){
            const END_POINT_URL = util.format(TICKET_MASTER_ATTRACTION_ID_API_URL, TICKETMASTER_API_KEY, artistName);
            request.get(END_POINT_URL, function(err, resp, body){
                if(err){
                    reject(err);
                }else{
                    resolve(extractArtistInformation(artistName, JSON.parse(body)));
                }
            });
        });
    });


    return Promise.all(ticketMasterArtistsInformations).then(function(result){
        return result.filter(artist => artist.name !== '' && artist.id !== '');
    });

}

function initializeGenre(genre){


    const LAST_FM_REQUEST_URL = "http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=%s&api_key=%s&format=json";

    var options = {
        url: util.format(LAST_FM_REQUEST_URL, genre,  LAST_FM_API_KEY),
        headers: {
            'User-Agent': 'request'
        }
    };

    return new Promise(function(resolve, reject){
        request.get(options, function(err, resp, body){
            if(err){
                reject(err);
            }else{
                var artists = extractArrayOfArtists(JSON.parse(body));
                var artistsInformation = getArtistsTicketMasterAttractionIds(artists);
                return resolve(artistsInformation);
            }
        })
    })
}

function initializeLocation(location){
    const GOOGLE_GEOCODING_API_URL = util.format("https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s", location, GOOGLE_GEOCODING_API_KEY);

    return new Promise(function(resolve, reject){
        request.get(GOOGLE_GEOCODING_API_URL, function(err, resp, body){
            if(err){
                reject(err);
            }else{
                var coordinates = extractCoordinates(JSON.parse(body));
                var geoHash = convertCoordinatesToGeoHash(coordinates);
                return resolve(geoHash);
            }
        })
    });

}

getTickets = function(req, res, next){
    var genrePromise = initializeGenre(req.params.genre);
    var locationPromise = initializeLocation(req.params.location);
    Promise.all([genrePromise, locationPromise]).then(getEventsForArtists).then(function(events){
        res.json(events);
    });

};

module.exports = getTickets;