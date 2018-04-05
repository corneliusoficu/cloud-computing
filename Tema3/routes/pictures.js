var express = require('express');
var router = express.Router();
multer = require('multer');
var logger = require('../logger');

var bla = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, req.param('name'))
    }
  });
  
var upload = multer({ storage: bla });
const Storage = require("@google-cloud/storage");
var bodyParser = require('body-parser');
const projectId = 'tema3-cloud-200115';

const storage = new Storage({
    projectId: projectId,
    keyFilename: 'storage-key.json'
});

const bucket = storage.bucket('ppppoze');

router.get('/', function(req, res, next) {
    //Aici ar trebuie sa vina formularul de upload pentru poza care sa apele postul pe pictures.
    logger.log("INFO", "Get on photos");
    res.send('Formular upload poza');
});

/* POST picture. */
router.post('/',upload.single('image'), function(req, res, next) {
    logger.log("INFO", "Starting the upload of photos!");
    console.log(req.file);
    var object_name = req.param('name');
    console.log(object_name);
    bucket.upload(req.file.path,{name: object_name}, function(err, file){
        logger.log("INFO", "Finished uploading!");
        if(!err){
            logger.log("INFO", `The upload of the file with name ${object_name} successfully finished! `);
            res.send("S-a uploadat poza! :)");
        }else{
            logger.log("ERROR", `The upload of the file with name ${object_name} failed!`);
            res.send('Nu s-a uploadat poza :(');
        }
    });
});

router.get('/:name', function(req, res, next){
    logger.log("INFO", `Requesting to view the picture with name: ${req.params.name}`);
    res.send("http://ppppoze.storage.googleapis.com/" + req.params.name);
});

module.exports = router;