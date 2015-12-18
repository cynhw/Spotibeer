var SpotifyStrategy = require('passport-spotify').Strategy;
var db              = require('../models');

module.exports = {
	spotifyStrategy : new SpotifyStrategy({
			clientID     : process.env.SPOTIFY_CLIENT,
			clientSecret : process.env.SPOTIFY_SECRET,
			callbackURL  : process.env.BASE_URL + '/auth/callback/spotify/'
		},
		function(accessToken, refreshToken, profile, done){
			//console.log(profile._json); // real data returned by spotify
			db.provider.find({
				where : {
					pid  : profile.id,
					type : profile.provider
				},
				include : [db.user]
			}).then(function(provider){
				if(provider && provider.user){
					provider.token = accessToken,
					provider.save().then(function(){
						done(null, provider.user.get());
					});
				} else {
					var username = profile.username;
					var name = profile.displayName.replace('\\','');
					db.user.findOrCreate({
						where    : {username : username},
						defaults : {name: name}
					}).spread(function(user, created){
						if(created){
							user.createProvider({
								pid   : profile.id,
								token : accessToken,
								type  : profile.provider
							}).then(function(){
								done(null, user.get());
							})
						} else {
							done(null, false, {message: 'You already signed up with this Spotify Account. Please Login'})
						}
					})
				}
			});
		}
	),
	serializeUser: function(user, done){
		done(null, user.id);
	},
	deserializeUser: function(id, done){
		db.user.findById(id).then(function(user){
			done(null, user.get());
		}).catch(done);
	}
};