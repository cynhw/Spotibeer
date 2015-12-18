var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();

// Get Genre From Beer Style Function //

var getBeerToGenre = function(beer) {

// Good Ol' Americana Beers

	if(beer.indexOf("American-Style" && "IPA") !== -1) {
		return "blues-rock";
	}

	else if(beer.indexOf("American-Style" && "Amber Ale" && "Red Ale") !==-1) {
		return "folk+pop";
	}

	else if(beer.indexOf("American-Style" && "Stout") !==-1) {
		return "rock";
	}

	else if(beer.indexOf("American-Style" && "Lager") !==-1) {
		return "boy+band";
	}

	else if(beer.indexOf("Brown Porter") !==-1){
		return "blues&genre=rock";
	}

	// Beers of the Great North America

	else if(beer.indexOf("North-American" && "Lager") !==-1) {
		return "folk+pop";
	}

	else if(beer.indexOf("North-American" && "Light Lager") !==-1) {
		return "pop&genre=jazz";
	}

	else if(beer.indexOf("North-American" && "Amber Lager") !==-1) {
		return "boy+band";
	}

	else if(beer.indexOf("North-American" && "Premium Lager") !==-1) {
		return "boy+band&genre=pop+punk";
	}

	else if(beer.indexOf("North-American" && "Pilsener") !==-1) {
		return "boy+band";
	}

	else if(beer.indexOf("North-American" && "Malt Lager") !==-1) {
		return "boy+band";
	}

	else if(beer.indexOf("North-American" && "Oktoberfest") !==-1) {
		return "chill-out+trance";
	}

	else if(beer.indexOf("North-American" && "Dark" && "Lager") !==-1){
		return
	}

	else if(beer.indexOf("Brown Porter") !==-1){
		return "blues&genre=rock";
	}
// the British and English contenders

	else if(beer.indexOf("British-Style" && "Imperial") !==-1) {
		return "british+alternative+rock";
	}

	else if(beer.indexOf("English-Style" && "Pale" && "Ale") !==-1){
		return "british+alternative+rock";
	}

	else if(beer.indexOf("English-Style" && "Dark" && "Ale") !==-1){
		return "british+alternative+rock";
	}

	else if(beer.indexOf("English-Style" && "IPA") !==-1){
		return "british+alternative+rock";
	}

	// Belgian-Style beeeeers

	else if(beer.indexOf("Belgian-Style" && "Blonde" && "Ale") !==-1){
		return "alternative-rock";
	}

	else if(beer.indexOf("Belgian-Style" && "Pale") !==-1){
		return "alternative-rock";
	}

	else if(beer.indexOf("Belgian-Style" && "Wheat") !==-1){
		return "alternative-rock";
	}

	else if(beer.indexOf("Belgian-Style" && "White") !==-1) {
		return "alternative-rock";
	}
// Ze German Biers

	else if(beer.indexOf("German" && "Weisse") !==-1) {
		return "german+punk";
	}

	else if(beer.indexOf("German" && "Hefeweissbier") !==-1) {
		return "german+pop+rock";
	}

	else if(beer.indexOf("German" && "Hefeweizen") !==-1) {
		return "german+techno";
	}

	else if(beer.indexOf("German" && "Weissbeer") !==-1) {
		return "german+punk";
	}

	else if(beer.indexOf("German" && "Dunkel" && "Weizen") !==-1) {
		return "indie+rock";
	}

	else if(beer.indexOf("German" && "Dunkel" && "Weissbier") !==-1) {
		return "indie+rock";
	}

	else if(beer.indexOf("German" && "Kellerbier") !==-1) {
		return "indie+rock";
	}

	else if(beer.indexOf("Zwickelbier") !==-1) {
		return "indie+rock";
	}

	else if(beer.indexOf("Doppelbock") !==-1) {
		return "indie+rock";
	}

	else if(beer.indexOf("German-Style" && "Pilsener") !==-1) {
		return "german-techno";
	}

	else if(beer.indexOf("German-Style" && "Schwarzbier") !==-1) {
		return "europop"
	}

	else if(beer.indexOf("Bamberg-Style" && "Rauchbier") !==-1){
		return "europop"
	}

	// the Cider

	else if(beer.indexOf("Dry Mead") !==-1) {
		return "funk";
	}

	else if(beer.indexOf("Semi-Sweet Mead") !==-1){
		return "garage+pop";
	}

	else if(beer.indexOf("Sweet Mead") !==-1){
		return "indie+r&b";
	}

	else if(beer.indexOf("Common Cider") !==-1){
		return "hip+pop";
	}

	else if(beer.indexOf("French Cider") !==-1){
		return "french+pop&genre=jazz";
	}

}

router.get('/search', function(req, res){
	var results ="";
	var api = process.env.BEER_API_KEY;
	var beers = req.query.q;
	var url = ('http://api.brewerydb.com/v2/search?q=' + beers + '&type=beer' + '&key=' + api);
	request(url, function(err, response, data){
		var beerNames = JSON.parse(data);
		results = results + beers;
		res.render('beers/search', {results: beerNames});
	});
});

router.get('/:beerId', function(req, res){
	var api = process.env.BEER_API_KEY;
	var beerId = req.params.beerId;
	var url = ('http://api.brewerydb.com/v2/beer/' + beerId + '?withBreweries=Y' +'&key=' + api);
	request(url, function(err, response, data){
		var beer = JSON.parse(data);
		
		// requesting data from the Echo Next API

		var echonest = process.env.ECHONEST_API_KEY;
		var beerGenre = getBeerToGenre(beer.data.style.name);
		var beerPlaylist = ('http://developer.echonest.com/api/v4/playlist/static?api_key=' + echonest + '&genre=' + beerGenre + '&results=15&type=genre-radio&bucket=id:spotify&bucket=tracks&limit=true');
			request(beerPlaylist, function(err, response, data){
				var playlist = JSON.parse(data).response;
				// look up user, save playlist to playlist table. Use strategies.js as an example of user > provider.
				var artists = playlist.songs;
				// console.log(artists);
				var tracks = artists[0].tracks[0].foreign_id;
				console.log(tracks);

				res.render('beers/results', {results : beer, artists: artists});
			});

		// var breweries = beer.data.breweries;
		// render after all requests are done
		
		// // console.log(beer.data.breweries);
		// console.log(beer);
	});
});

module.exports = router;