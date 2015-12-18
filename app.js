// storing all the var require up here

var express    = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session    = require('express-session');
var request    = require('request');
var passport   = require('passport');
var flash      = require('connect-flash');
var strategies = require('./config/strategies');
var db         = require('./models');
var app        = express();

// storing all the app.set and app.use below

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(session({
	secret : 'Hello Kitty Sucks',
	resave : false,
	saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategies.spotifyStrategy);
passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
})

// try rendering to test out

app.get('/', function(req, res) {
	res.render('index');
});

// grabbing the user secret stuff + creating playlist

// app.get('/test', function(req, res){
// 	db.user.find(
// 		{ where: {username : req.user.username}
// 	}).then(function(user){ console.log(req.user.username);
// 		user.getProviders({where: {type: 'spotify'}}).then(function(providers){
// 			var user_id = providers[0].dataValues.pid;
// 			var token = providers[0].dataValues.token;
// 			var options = {
// 				method : 'POST',
// 				url : 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
// 				headers : {
// 					'Accept' : 'application/json',
// 					'Authorization' : 'Bearer ' + token,
// 					'Content-Type'  : 'application/json'
// 				},
// 				form : JSON.stringify({
// 				  "name": "New Playlist",
// 				  "public": true
// 				})
// 			}
// 			request(options, function(err, response, body){
// 				console.log(err, response, body);
// 				res.send(body);
// 			});
// 		});
// 	});
// })

app.get('/user', function(req, res){
	db.user.find(
		{ where : {username : req.user.username }
	}).then(function(user){
		user.getProviders(
			{where : 
				{ type : 'spotify'}
			}).then(function(providers){
				var user_id = providers[0].dataValues.pid;
				var token = providers[0].dataValues.token;
				var options = {
					method 	: "GET",
					url : "https://api.spotify.com/v1/me",
					headers	: { 
						'Authorization' : 'Bearer ' + token 
					}, 
				}
				request(options, function(err, response, body){
					var user = JSON.parse(body);
					console.log(user);
					res.render('user', {users : user});
				});
			});
	});
});

// controllers routes below

app.use('/beers', require('./controllers/beer'));
app.use('/auth', require('./controllers/auth'));
// app.use('/user', require('./controllers/user'));

// let's connect the the server to not freak out about the errors

app.listen(process.env.PORT || 3000);
console.log('beer + music = spotiBeer.');