var logger    = require('winston');

var not_found = require('./not_found_handler');
var dogs      = require('./dogs_handler');

var handlers = [dogs, not_found];

var notFoundHandler = not_found;

exports.handleRequest = function(request, response) {

    logger.log('info', "Handling new request for URL: " + request.url + " and method: " + request.method);

    loop1:
    for(index = 0; index < handlers.length; index++){
        for(indexRes = 0; indexRes < handlers[index].length; indexRes++){

            var resource = handlers[index][indexRes];

            var matches_array = resource.URI.exec(request.url);
            resource.URI.lastIndex = 0;

            logger.log('info', '.' + request.url + '.');

            if(matches_array && resource.METHOD === request.method){

                var variables = [];

                if(matches_array.length > 1){
                    variables = matches_array;
                    variables.slice(0, 1);
                }



                resource.ENDPOINT(request, response, variables);

                break loop1;
            }
        }
    }
};

