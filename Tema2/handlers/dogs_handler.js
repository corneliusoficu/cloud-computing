var logger         = require('winston');
var Dog            = require('../models/dog');
var responseHelper = require('../helpers/response_helper');

dogs_handler = [
    {
        METHOD: "GET",
        URI: /^\/api\/v1\/dogs$/gi,
        ENDPOINT: function(request, response, variables){
            Dog.find({}, function(err, docs){
                if(err){
                    var responseMessage = {"Error Message": "Could not get all dogs!"};
                    responseHelper.sendResponse(response, responseMessage, 500);
                }else{
                    responseHelper.sendResponse(response, docs, 200);
                }
            })
        }
    },
    {

        METHOD: "GET",
        URI: /^\/api\/v1\/dog\/(\w+)$/gi, /*  /api/v1/dogs  */
        ENDPOINT: function(request, response, variables){
            if(variables.length < 2){
                var responseMessage = {"Error Message": "Could not get dog name from URI!"};
                responseHelper.sendResponse(response, responseMessage, 500);
                return;
            }

            Dog.find({"name": variables[1]}, function (err, docs) {
                if(docs.length === 0){
                    var responseMessage = {"Error Message": "Could not find dog with name: " + variables[1]};
                    responseHelper.sendResponse(response, responseMessage, 404);
                }else{
                    responseHelper.sendResponse(response, docs, 200);
                }
            });
        }
    },
    {
        METHOD: "PUT",
        URI: /^\/api\/v1\/dog\/(\w+)$/gi,
        ENDPOINT:  function(request, response, variables){
            if(variables.length < 2){
                var responseMessage = {"Error Message": "Could not get dog name from URI!"};
                responseHelper.sendResponse(response, responseMessage, 500);
                return;
            }

            Dog.find({"name": variables[1]}, function (err, docs) {

                var newDogObject = JSON.parse(request.body);

                if(docs.length === 0){

                    if(!('breed' in newDogObject)) {

                        var responseMessage = {"Error Message": "Not all required fields provided while creating new dog!"};
                        responseHelper.sendResponse(response, responseMessage, 422);

                    }else{
                        newDogObject.name = variables[1];
                        var newDog = new Dog(newDogObject);
                            newDog.save(function(err, dog){
                            //CREATED
                            responseHelper.sendResponse(response, dog, 201);
                        });
                    }
                }else{
                    Dog.findOneAndUpdate({"name": variables[1]}, newDogObject, {upsert: false}, function(err, doc){
                        if(err){
                            var responseMessage = {"Error Message": "Error updating dog: " + variables[1]};
                            responseHelper.sendResponse(response, responseMessage, 500);
                        } else{
                            responseHelper.sendResponse(response, doc, 200);
                        }
                    });
                }
            });
        }
    },
    {
        METHOD: "DELETE",
        URI: /^\/api\/v1\/dog\/(\w+)$/gi,
        ENDPOINT: function(request, response, variables) {

            if(variables.length < 2){
                var responseMessage = {"Error Message": "Could not get dog name from URI!"};
                responseHelper.sendResponse(response, responseMessage, 500);
                return;
            }

            Dog.find({"name": variables[1]}, function (err, docs) {
                if(docs.length === 0){

                    var responseMessage = {"Error Message": "Could not find dog with name: " + variables[1]};
                    responseHelper.sendResponse(response, responseMessage, 404);

                }else{

                    Dog.remove({"name": variables[1]}, function(err){

                       if(!err){
                           responseHelper.sendResponse(response, null, 204 );
                       }else{

                           var responseMessage = {"Error Message": "Error occured while deleting dog: " + variables[1]};
                           responseHelper.sendResponse(response, responseMessage, 500 );
                       }
                    });
                }
            });

        }
    },
    {
        METHOD: "POST",
        URI:   /^\/api\/v1\/dog$/gi, /*  /api/v1/dog  */
        ENDPOINT: function(request, response, variables){

            var newDogObject = JSON.parse(request.body);

            if(!('breed' in newDogObject && 'name' in newDogObject)) {

                //Unprocessable Entity
                var responseMessage = {"Error Message": "Not all required fields provided!"};
                responseHelper.sendResponse(response, responseMessage, 422);

                return;
            }

            var newDog = new Dog(newDogObject);

            Dog.find({"name": newDogObject.name}, function (err, docs) {
                if(docs.length){
                    //CONFLICT
                    var responseMessage = {"Error Message": "A dog with name: " + newDogObject.name + " already exists!"};
                    responseHelper.sendResponse(response, responseMessage, 409);
                }else{
                    newDog.save(function(err, dog){
                        //CREATED
                        responseHelper.sendResponse(response, dog, 201);
                    });

                }
            });
        }
    }
];

module.exports = dogs_handler;