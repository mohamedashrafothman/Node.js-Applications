const mongoose  = require('mongoose');
// const db = mongoose.connection;
const bcrypt    = require('bcrypt');
const Schema    = mongoose.Schema;

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb://localhost/nodeauth');


// User Schema
const UserSchema = new Schema({
    username:{
        type: String,
        index: true
    },
    password: {
        type: String,
        bcrypt: true,
        required: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
});

const User = module.exports = mongoose.model('user', UserSchema);


module.exports.comparePassword = (candidatePassword, hash, callback)=> {
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=> {
        if(err) return callback(err);
        callback(null, isMatch);

    });
};


module.exports.createUser = (newUser, callback)=> {
    bcrypt.hash(newUser.password, 10, (err, hash)=> {
        if(err) throw err;
        // set hash password
        newUser.password = hash;
        // Save new User
        newUser.save(callback);
    });
    newUser.save(callback);
};

module.exports.getUserByUsername = (username, callback)=> {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = (id, callback)=> {
    User.findById(id, callback);
};
