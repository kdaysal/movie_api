/**
* Mongoose is an ODM (Object Document Mapper) that I am using with
* my MongoDB document architecture for the purpose of enforcing
* uniformity in my data via specified models from the application-side 
* to ensure that all data follows a specified format.
*/

//require the Mongoose package and models.js file
const mongoose = require('mongoose');
const Models = require('./models.js');

//Server-Side Validation
const { check, validationResult } = require('express-validator');

//these variables refer to the model names as defined in the models.js file
const Movies = Models.Movie;
const Users = Models.User;

/**
* The section below allows Mongoose to connect to the db to perform CRUD operations 
* on its documents from within my REST API. For learning purposes, note
* that `process.env.CONNECTION_URI` is using environment variables to hide
* the online database's connection URI
*/

console.log(process.env.CONNECTION_URI);//for debugging connection errors
//For learning purposes, the original line was: mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }); //note -  my db name is the default 'test' (for now)
mongoose.connect(process.env.CONNECTION_URI || 'mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }); //note - with this syntax, can still connect to localhost (port 8080)

//Utilizing Express framework for this app
const express = require('express'),
  morgan = require('morgan'), //custom middleware for loging all request details to a log.txt file
  bodyParser = require('body-parser'), //middleware for error-handling
  methodOverride = require('method-override'), //middleware for error-handling
  uuid = require('uuid');
const res = require('express/lib/response');
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static('public')); //serves static files from the 'public' folder

const cors = require('cors'); // implement CORS (Cross-Origin-Resource-Sharing) so the receiving server can identify where requests are coming from and allow or disallow them
app.use(cors()); //leaving the default set up to allow requests from ALL origins for purposes of task 2.10, but this will be modified later to give only certain origins access 

/**
* The example code block below allows only certain origins access 
* to my API (to implement - refactor as needed, then use this block 
* to replace the 'app.use(cors());' line from above ^)
*/

/*
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
*/

let auth = require('./auth')(app);
const passport = require('passport'); //require the passport module
require('./passport'); //import the passport.js file - recall that Node will look for a 'passport.js' file in my root directory even though I didn't specify the '.js' extension

/**
* Below are my HTTP requests - these are just endpoints (or routes) 
* The structure is: app.METHOD(PATH, HANDLER) 
* Remember that 'app' is just an instance of express()
*/

// CREATE - POST - Allow new users to register (i.e. add new user)) - note, no authentication parameter in this endpoint/route
/**
* Validates that Username, Password, and Email inputs are all correctly formatted
* @param {string} Username
* @param {string} Password
* @param {string} Email
*/
app.post('/users',
  // Validation logic for the request
  [
    check('Username', 'Username is required').isLength({ min: 5 }), //Username >= 5 chars
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(), //Username does not contain invalid special chars
    check('Password', 'Password is required').not().isEmpty(), //Password is provided
    check('Email', 'Email does not appear to be valid').isEmail() //Email is valid format
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) { //if there are errors
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password); //hash the password
    Users.findOne({ Username: req.body.Username }) // Search to see if the requested username already exists in the db
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else { //otherwise create the new user
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword, //hash password prior to storing in db
              Email: req.body.Email,
              BirthDate: req.body.BirthDate
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//UPDATE - PUT - update user info -by username-
app.put('/users/:username', passport.authenticate('jwt', { session: false }), [
  check('Username', 'Username is required').isLength({ min: 5 }), //Username >= 5 chars
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(), //Username does not contain invalid special chars
  check('Password', 'Password is required').not().isEmpty(), //Password is provided
  check('Email', 'Email does not appear to be valid').isEmail() //Email is valid format
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) { //if there are errors
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password); //hash the password
  Users.findOneAndUpdate({ Username: req.params.username }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      BirthDate: req.body.BirthDate
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// CREATE - POST - Add a movie to a user's list of favorite movies -by Username- -by MovieID-
app.post('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, {
    $push: { FavoriteMovies: req.params.movieid }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(201).json(updatedUser);
      }
    });
});

//DELETE - Allow users to remove a movie from their list of favorites -by movie name-
app.delete('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username },
    {
      $pull: { FavoriteMovies: req.params.movieid }
    },
    { new: true }, // this line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//DELETE - Allow existing users to deregister from myFlix - by username-
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ - GET - Show home directory content
/**
 * Redirect user to home directory (index.html)
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

// READ - GET - return a list of ALL movies in the myFlix database
//PASSPORT.AUTHENTICATE(...) is temporarily removed for testing purposes. Will restore later with the commented-out code block below this section
app.get("/movies", passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// READ - GET - return data about a move -by title-
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - GET - return data about a specific genre -by genre name-
app.get('/movies/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genre })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    });
});

// READ - GET - return data about a director -by director name-
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    });
});

// READ - GET - return data about a specific user -by username-
//TODO - refactor to use lowercase ':username' for the url variable to maintain consistency with the rest of the url variables
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//error handling - must come last in chain of middleware but before app.listen()
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong - oh no!');
});

/**
 * Listen for requests and run the server on the specified params OR port 8080
 * @function app.listen
 * @param {number} port
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port); //always make sure this line is printed to the terminal before testing requests, otherwise your app is not running (listening)
});
