var logger = require('winston');

dogs_handler = [
    {

        METHOD: "GET",
        URI:   /^\/api\/v1\/dogs$/gi, /*  /api/v1/dogs  */
        ENDPOINT: function(request, response, variables){
            response.write('DOGS');
            response.end();
        }
    },
    {
        METHOD: "POST",
        URI:   /^\/api\/v1\/dog$/gi, /*  /api/v1/dog  */
        ENDPOINT: function(request, response, variables){

            logger.log('info', request.body);

            response.write('DOG');
            response.end();
        }
    },
    {
        METHOD: "GET",
        URI: /^\/api\/v1\/dog\/([0-9]+)$/gi, /*  /api/v1/dog/id  */
        ENDPOINT: function(request, response, variables){
            response.write("21");
            response.end();
        }
    }
];

module.exports = dogs_handler;