const projectId = 'tema3-cloud-200115';

const Logging = require('@google-cloud/logging');
const logging = new Logging({
    projectId: projectId,
    keyFilename: 'logging-key.json'
});

const logger = {};

logger.log = function(severity, message){
    const logName = 'my-log';
    const log = logging.log(logName);

    const metadata = {resource: {type: 'global'}};
    const entry = log.entry(metadata, message);

    log
        .write(entry)
        .then(() => {
            switch(severity){
                case "ERROR":
                    console.error(`${message}`);
                    break;
                case "INFO":
                    console.log(`${message}`);
                    break;
                case "WARN":
                    console.warn(`${message}`);
                    break;
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};

module.exports = logger;