var express  = require('express');
var passport = require('passport');
var db       = require('../models');
var router   = express.Router();

router.get('/login/spotify', function(req, res){
	passport.authenticate(
		'spotify',
		{scope : ['playlist-modify-public', 'user-library-read']}
	)(req, res);
});

router.get('/callback/spotify', function(req, res){
	passport.authenticate('spotify', function(err, user, info){
		if(err) throw err;
		if(user){
			req.login(user, function(err){
				if(err) throw err;
				req.flash('success', 'You are now logged in with Spotify');
				res.redirect('/');
			});
		} else {
			req.flash('danger', 'Error');
			res.redirect('/');
		}
	})(req, res);
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('info', 'You have been logged out.');
	res.redirect('/');
});

module.exports = router;