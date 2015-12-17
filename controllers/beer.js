var express = require('express');
var request = require('request');
var router = express.Router();

// Get Genre From Beer Style Function //

var getBeerToGenre = function(beer) {

// Good Ol' Americana Beers

	if(beer.indexOf("American-Style" && "IPA") !== -1) {
		return "chillwave";
	}

	else if(beer.indexOf("American-Style" && "Amber Ale" && "Red Ale") !==-1) {
		return "folk+pop";
	}

	else if(beer.indexOf("American-Style" && "Stout") !==-1) {
		return "rock";
	}

	else if(beer.indexOf("Brown Porter") !==-1){
		return "pop";
	}
}

router.get('/search', function(req, res){
	var api = process.env.BEER_API_KEY;
	var beers = req.query.q;
	var url = ('http://api.brewerydb.com/v2/search?q=' + beers + '&type=beer' + '&key=' + api);
	request(url, function(err, response, data){
		var beerNames = JSON.parse(data);
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
		var beerPlaylist = ('http://developer.echonest.com/api/v4/playlist/static?api_key=' + echonest + '&genre=' + beerGenre + '&results=5&type=genre-radio&bucket=id:spotify&bucket=tracks&limit=true');
			request(beerPlaylist, function(err, response, data){
				var playlist = JSON.parse(data).response;
				var artists = playlist.songs;
				// console.log(artists);
				var tracks = artists[0].tracks[0].foreign_id;
				console.log(tracks);


	// 	artists.forEach(function(grab){
	// 	// console.log(grab.title);
	// 	// var tracks = artists.tracks;
	// 	console.log(grab.tracks[0].foreign_id[0]);

	// });



				res.render('beers/results', {results : beer, artists: artists});
			});

		// var breweries = beer.data.breweries;
		// render after all requests are done
		
		// // console.log(beer.data.breweries);
		// console.log(beer);
	});
});

module.exports = router;