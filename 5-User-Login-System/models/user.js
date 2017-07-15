const mongoose = require('mongoose');
const db = mongoose.connection;
const Schema    = mongoose.Schema;

// connect to the database
mongoose.connect('mongodb://localhost/nodeauth');


// User Schema
const UserSchema = new Schema({
    username:{
        type: String,
        index: true
    },
    password: {
        type: String
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

module.exports.createUser = (newUser, callback)=> {
    newUser.save(callback);
};
