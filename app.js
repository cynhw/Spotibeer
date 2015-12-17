// storing all the var require up here

var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var app = express();

// storing all the app.set and app.use below

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));

// try rendering to test out

app.get('/', function(req, res) {
	res.render('index');
});

// controllers routes below

app.use('/beers', require('./controllers/beer.js'));

// let's connect the the server to not freak out about the errors

app.listen(process.env.PORT || 3000);
console.log('beer + music = spotiBeer.');