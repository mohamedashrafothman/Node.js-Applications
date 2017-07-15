// require dependencies
const mongoose  = require('mongoose');
const url       = 'mongodb://localhost/users';

//Es6 Promises
mongoose.Promise = global.Promise;

// connecting to mongodb
before((done)=> {
    mongoose.connect(url);

    mongoose.connection.once('open', ()=> {
        console.log('Connection has been made!');
        done();
    }).on('error', (error)=> {
        console.log('Error: ', error);
    });
});
