var logger = require('winston');

not_found_handler = [
    {
        METHOD: "GET",
        URI:   /.*/gi,
        ENDPOINT: function(request, response, variables){
            logger.log('error'," NOT FOUND!");
            response.statusCode = 404;
            response.end();
        }
    }
];

module.exports = not_found_handler;