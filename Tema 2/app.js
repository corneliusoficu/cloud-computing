const http         = require('http');
const logger=require('./config/log.js');
const routeHandler = require('./handlers/requests_handler');

const PORT = 8080;

logger.log('info', 'Starting web server at port: ' + PORT);

var server = http.createServer(function(req,  res){

    logger.log('info', '-----------------------------------------------------------------------------');
    logger.log('info', 'Server received new request');

    var body = [];

    req.on('error', function(err){
        logger.log('error', 'Error receiving request!');
    }).on('data', function(chunk){
        body.push(chunk);
    }).on('end', function(){
        req.body = Buffer.concat(body).toString();
        routeHandler.handleRequest(req, res);
    });

}).listen(PORT);

server.on('error', function(e){
    logger.log('error', "Error creating webserver: " + e);
});

logger.log('info', 'Started web server at port: ' + PORT);

