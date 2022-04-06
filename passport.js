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
            return callback(null, false, { message: 'Incorrect username or password.' });
        }

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