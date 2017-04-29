var express = require('express');
var path	= require('path');
var routes	= require('./routes/index');
var app = express();
var port = process.env.PORT || 8000;

// setup view engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '/views'))

//  Midelwares
app.use('/assets', express.static(path.join(__dirname, '/public')));

// routes
app.get('/', routes.home);
app.get('/star_wars_episode/:episode_number?', routes.movie_single);
app.get('*', routes.notFound);


app.listen(port, function(){
	console.log(`you are now listen to localhost:${port} 	(CTRl+C to exit)`);
});