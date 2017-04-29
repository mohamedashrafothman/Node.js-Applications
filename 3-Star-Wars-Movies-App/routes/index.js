var moviesJSON = require('../movies.json');


module.exports.home = function(req, res){
	var movies = moviesJSON.movies;
	res.render('index', {title:'Star War | Home Page', movies: movies});
};
module.exports.movie_single = function(req, res){
	var episode_number = req.params.episode_number;
	var movies = moviesJSON.movies;

	if(episode_number<= movies.length && episode_number>=1){
		var movie = movies[episode_number - 1];
		var title = movie.title;
		var main_characters = movie.main_characters;
		res.render('movie_single',{
			title: title,
			movies:movies, 
			movie:movie,
			main_characters: main_characters
		});
	}else{
		res.render('notFound', {
			movies: movies,
			title: 'this page not found.'
		});
	}
	
};

// not found page
module.exports.notFound = function(req, res){
	var movies = moviesJSON.movies;
			res.render('notFound', {
			movies: movies,
			title: 'this page not found.'
		});
};
