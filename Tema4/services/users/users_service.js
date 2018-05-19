var User = require('../../models/user');
var bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

var users_service = {}

users_service.does_user_exists = function(req) {
    var username = req.body.username;
    var password = req.body.password;

    return new Promise((resolve, reject)=>{
        
        User.findOne({username: username}, (err, user)=>{
            if(err) {
                reject("Error when searching if user exists!");
            } else {
                if(user === null){
                    reject("Wrong credentials!");
                } else {
                    bcrypt.compare(password, user.password, (err, res)=>{
                        if(res == true){
                            resolve();
                        } else{
                            reject("Wrong credentials!");
                        }
                    });
                }
            }
        });
    });
}

users_service.store_new_user = function(req) {
    var username = req.body.username;
    var password = req.body.password;

    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, SALT_ROUNDS, function(err, hash){
            User.create({username: username, password: hash}, function(err, small){
                if(err){
                    reject("Error when storing user!");
                    console.log(err);
                } else {
                    resolve();
                }
            });
        });
    });   
}

users_service.does_username_exist = function(username) {

    return new Promise(function(resolve, reject){
        User.findOne({username: username}, (err, user)=>{
            if(err) {
                reject("Error when searching if user exists!");
            } else {
                if(user === null){
                    resolve();
                } else {
                    reject("User already exists!");
                }
            }
        });
    });
}

module.exports = users_service;