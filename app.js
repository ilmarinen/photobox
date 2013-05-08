
var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var connStr = 'mongodb://localhost:27017/mongoose-bcrypt-test';
mongoose.connect(connStr, function(err){
    if(err) throw err;
    console.log('Successfully connected to MongoDB');
});

app = express();

var simple_auth = require('./local_modules/simple-auth/')

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({secret: 'my other secret'}));
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
    res.render('welcome', {title: 'Photobox', header: 'Welcome to Photobox'});
});

require('./local_modules/simple-auth/routes');
require('./local_modules/photobox/routes');


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
