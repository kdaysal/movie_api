/**
* This file contains logic for using 'passport' to authenticate users
* along with 'jsonwebtoken' to generate a JWT token for the user's session
*/

const jwtSecret = 'your_jwt_secret'; //This must be the same key used in the JWTStrategy (passport.js file)

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //My local passport file

/**
 * Function to create a JWT token for a given user
 * @function generateJWTToken
 * @param {Object} user
 * @returns {Object} user
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username I'm encoding into the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    });
}


//POST login actions
/**
 * Function to log the user in and generate a JWT token
 * @function [path]/login
 * @param {any} router
 * @returns {Object} user
 * @requires passport
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) { //if an error is encountered, or if the user does not exist...
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token }); //This is ES6 shorthand for res.json({ user: user, token: token }). This can be done in ES6 if my keys are the same as my values
            });
        })(req, res);
    });
}