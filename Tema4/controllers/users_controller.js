var users_service = require('../services/users/users_service');

exports.get_login_page = function(req, res, next) {
    console.log(req.session.Auth);
    res.render('login', { title: 'Sign in' });
}
exports.get_register_page = function(req, res, next) {
    res.render('register', { title: 'Register' });
}

exports.login_user = function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    
    users_service.does_user_exists(req)
    .then((result)=>{
        req.session.Auth = username;
        res.redirect('books');
    })
    .catch((err)=>{
        res.render('login',{title: 'Login', error: err});
    });
}

exports.register_user = function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;
    
    if(!password || !repassword || !username) {
        res.render('register',{title: 'Register', error: 'You need to fill all fields!'});
        return;
    }

    if(password != repassword) {
        res.render('register',{title: 'Register', error: 'Passwords do not match!'});
        return;
    }

    users_service.does_username_exist(username)
    .then((result)=>{
        return users_service.store_new_user(req);
    })
    .then((result)=>{
        res.redirect('login');
    })
    .catch((err)=>{
        res.render('register',{title: 'Register', error: err});
    });
}