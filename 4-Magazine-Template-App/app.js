const express           = require('express');
const path              = require('path');
const routes            = require('./routes/index');
const app               = express();
const port              = process.env.PORT || 2000;


// setup View Engine
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'));

// Middelware
app.use(express.static(path.join(__dirname, '/assets')));

// Routes
app.get('/', routes.home);
app.get('/single_article/:article_number?', routes.single_article);
app.get('*', routes.not_found);


// Listen to the server
app.listen(port, ()=> {
    console.log(`You are now listening to localhost:${port} (CTRl+C to exit)`);
});
