var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

// Your Google Cloud Platform project ID
const projectId = 'tema3-cloud-200115';

// Creates a client
const datastore = new Datastore({
    projectId: projectId,
    keyFilename: 'datastore-key.json'

});
// The kind for the new entity
const kind = 'Users';
// The name/ID for the new entity
const name = 'User1';
// The Cloud Datastore key for the new entity
const taskKey = datastore.key([kind, name]);

var app = express();
app.use(express.json());

function listUsers(res) {
    const query = datastore.createQuery('User1');

    datastore
        .runQuery(query)
        .then(results => {
            const tasks = results[0];

            console.log('User:');
            tasks.forEach(task => {
                const taskKey = task[datastore.KEY];
                console.log(taskKey.id, task);
            });
            res.send(tasks);
        })
        .catch(err => {
            res.render('ERROR:');
        });
}


/* GET users listing. */
router.get('', function(req, res, next) {
    listUsers(res);
});

function deleteUser(id) {
    var userKey = datastore.key(['User1', datastore.int(id)]);
    // datastore.get(key, function(err, entity) {
    // });
    datastore
        .delete(userKey)
        .then(() => {
            console.log(`User ${id} deleted successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}

function deleteAll() {
    const query = datastore.createQuery('User1');
    datastore
        .runQuery(query)
        .then(results => {
            const users = results[0];
            users.forEach(user => {
                const userKey = user[datastore.KEY];
                //console.log(taskKey.id, task);
                datastore
                    .delete(userKey)
                    .then(() => {
                        //console.log(`Collection deleted successfully.`);
                    })
            });
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}

//delete all
router.delete('/', function(req, res, next) {
    deleteAll();
    res.sendStatus(200);
});

//delete user
router.delete('/:id', function(req, res, next) {
    deleteUser(req.params.id);
    res.sendStatus(200);
});


//update user
router.put('/:id', function(req, res, next){
    if (!req.body) return res.sendStatus(400)
    console.log(req.body);
    var userKey = datastore.key(['User1', datastore.int(req.params.id)]);
    const entity = {
        key: userKey,
        data: [
            {
                name: 'name',
                value: req.body.name,
            },
            {
                name: 'age',
                value: req.body.age,
            },
            {
                name: 'job',
                value: req.body.job,
            },
        ],
    };
    datastore
        .save(entity)
        .then(() => {
            console.log(`User ${userKey.id} updated successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    res.send(console.log(`User ${userKey.id} updated successfully.`));
})

router.post('/', function(req, res, next){
    if (!req.body) return res.sendStatus(400)
    const taskKey = datastore.key('User1');
    const entity = {
        key: taskKey,
        data: [
            {
                name: 'name',
                value: req.body.name,
            },
            {
                name: 'age',
                value: req.body.age,
            },
            {
                name: 'job',
                value: req.body.job,
            },
        ],
    };

    datastore
        .save(entity)
        .then(() => {
            console.log(`User ${taskKey.id} created successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    res.send('respond with a resource');
});

module.exports = router;