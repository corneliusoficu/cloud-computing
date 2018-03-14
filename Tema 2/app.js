const http         = require('http');
const logger=require('./config/log.js');
const routeHandler = require('./handlers/requests_handler');

const PORT = 8080;

logger.log('info', 'Starting web server at port: ' + PORT);

var server = http.createServer(function(req,  res){

    logger.log('info', '-----------------------------------------------------------------------------');
    logger.log('info', 'Server received new request');

    var responseContent = routeHandler.handleRequest(req);

    res.write(responseContent);
    res.end();

}).listen(PORT);

server.on('error', function(e){
    logger.log('error', "Error creating webserver: " + e);
});

logger.log('info', 'Started web server at port: ' + PORT);

