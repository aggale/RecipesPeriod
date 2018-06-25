var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pug = require('pug');

var AWS = require('aws-sdk');
AWS.config.update({
	region: "us-east-2"
});
var db = new AWS.DynamoDB.DocumentClient();

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var recipeRouter = require('./routes/recipe');
var searchRouter = require('./routes/search');
var apiRouter = require('./recipe/recipecontroller');

var app = express();

// View engine
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// For API
app.use('/api', apiRouter);
// For regular web app
app.use('/', indexRouter);
//app.use('/', allrecipesRouter);
app.use('/recipe', recipeRouter);
app.use('/search', searchRouter);
app.use('/about', aboutRouter);


var port = 8081;
app.listen(port);
console.log('Server started on port 8081');
