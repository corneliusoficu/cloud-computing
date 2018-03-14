var logger    = require('winston');
var urlParser = require('../utils/parser');

exports.handleRequest = function(request) {

    logger.log('info', "Handling new request for URL: " + request.url + " and method: " + request.method);
    var urlInformation = urlParser.parseURI(request.url);

    logger.log('info', 'Resulted information from parsed URI: ' + JSON.stringify(urlInformation));

    return "Haha";
};