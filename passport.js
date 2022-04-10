/*
This file is used to define authentication / authorization strategies including JWT (Jason Web Token) and password hashing
*/

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy, //this will define the basic HTTP authentication for login requests
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        //if an error occurs, pass an error msg to the callback
        if (error) {
            console.log(error);
            return callback(error);
        }
        //if username is not found in the db, pass an error msg to the callback
        if (!user) {
            console.log('incorrect username');
            return callback(null, false, { message: 'Incorrect username.' });
        }

        //check if hashed passwords match up (by hashing any password entered by the user when logging in before comparing it to the hashed password stored in MongoDB)
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect password.' });
        }

        //if no error occurs and username is found and hashed passwords match-up, return the user info
        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //extract JWT from the header of the HTTP request
    secretOrKey: 'your_jwt_secret' //secret key to verify the signature of the JWT
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));