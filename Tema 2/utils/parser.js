const PATH_DELIMITER       = '/';
const QUERY_DELIMITER      = '?';
const ATTR_VALUE_DELIMITER = '&';
const ASSIGNMENT_DELIMITER = '=';

var logger = require('winston');

exports.parseURI = function(uri){

    var urlInformation  = {};
    urlInformation.path = [];
    urlInformation.GET  = [];

    if(uri.length === 1) {
        logger.log('info', "Homepage url!");
        urlInformation.path = ['/'];
    }else{

        var queryCharSplit = uri.split(QUERY_DELIMITER);
        logger.log('info', "Split url by query param(?): " + queryCharSplit + ' Size: ' + queryCharSplit.length);

        if(queryCharSplit.length > 2 || queryCharSplit.length === 0){
            logger.log('error', "Error splitting by: " + QUERY_DELIMITER);
        }else if(queryCharSplit.length === 2){
            urlInformation.path = parsePath(queryCharSplit[0]);
            urlInformation.GET  = parseQuery(queryCharSplit[1]);
        }


    }

    return urlInformation;

};

function parsePath(path){
    var splittedPath = path.split(PATH_DELIMITER);
    splittedPath.splice(0, 1);
    logger.log('info', 'Split path into: ' + splittedPath + ' length: ' + splittedPath.length);
    return splittedPath;
}

function parseQuery(query){

    var getParams = [];

    var attributeValues = query.split(ATTR_VALUE_DELIMITER);
    logger.log('info', 'Split query attribute values: ' + attributeValues + ' Size: ' + attributeValues.length);

    for(index = 0; index < attributeValues.length; index++){
        var attrValuePair = attributeValues[index].split(ASSIGNMENT_DELIMITER);

        if(attrValuePair.length !== 2){
            logger.log('error', 'Key pair not in correct format!');
            return [];
        }

        var key   = attrValuePair[0];
        var value = attrValuePair[1];

        var newPair = {};
        newPair[key] = value;

        getParams.push(newPair);

    }

    return getParams;
}