var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, res){
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
						'Authorization' : 'Bearer' + token 
					}, 
				}
				request(options, function(err, response, body){
					var user = JSON.parse(body).display_name;
					console.log(user);
			});
		});
	});
});

module.exports = router;