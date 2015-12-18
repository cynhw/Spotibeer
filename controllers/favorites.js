var express = require('express');
var db = require('../models');
var request = require('request');
var router = express.Router();


router.get('/', function(req,res) {
	db.favoritebeer.findAll().then(function(fav) {
		res.render('favorites', {fav: fav});
	});
});


module.exports = router;