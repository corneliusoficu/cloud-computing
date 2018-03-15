exports.sendResponse = function(response, responseMessage, statusCode){
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(responseMessage));
    response.end();
};