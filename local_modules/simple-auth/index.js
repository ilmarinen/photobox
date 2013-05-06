var mongoose = require('mongoose'),
    User = require('./user-model');



exports.connectDB = function(connectString, callback){
    mongoose.connect(connectString, function(err){
        if(err) console.log(err);
        callback(err);
    });
}



exports.authenticate = function(req, res, next){
    if(req.session.logged == true){
        next(req, res);
    }
    else{
        res.redirect('/login');
    }
}



exports.processRegister = function(req, res){
    if (req.body.password1 != req.body.password2){
        res.render('register', {title: "Passwords don't match."})
    }
    else{
        newuser = new User({
            username: req.body.username,
            password: req.body.password1
        });

        User.findOne({username: req.body.username}, function(err, user){
            if(!user){
                console.log('User does not exist.')
                newuser.save(function(err){
                    if(err) throw err;
                });
                res.render('simple-auth/welcome', {title: 'Account successfully created', username: req.body.username});
            }
            else{
                res.render('register', {title: "Account" + user.username +  "already exists."})
            }
        });
    }
}



exports.processLogin = function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
        if(user){
            user.comparePassword(req.body.password, function(err, isMatch){
                if(isMatch){
                    req.session.logged = true;
                    req.session.username = user.username
                    res.render('welcome', {title: 'Welcome', username: req.body.username});
                }
                else{
                    res.render('login', {title: "Invalid Login."});
                }
             });
        }
        else{
            res.render('login', {title: "Invalid Login."});
        }
    });
}



exports.login = function(req, res){
    if(req.session.logged == true){
        res.render('welcome', {title: 'Welcome', username: req.session.username});
    }
    else{
        res.render('login', {title: 'Login'});
    }
}


exports.register = function(req, res){
    res.render('register', {title: 'Register'})
}



