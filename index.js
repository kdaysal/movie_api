//require the Mongoose package and models.js file
const mongoose = require('mongoose');
const Models = require('./models.js');

//these variables refer to the model names as defined in the models.js file
const Movies = Models.Movie;
const Users = Models.User;

//this allows Mongoose to connect to the db to perform CRUD operations on its documents from within my REST API
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }); //leaving my db name as the default 'test' for now

//Utilize Express framework for this app
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

//the example code block below allows only certain origins access to my API (to implement - refactor as needed, then use this block to replace the 'app.use(cors());' line from above ^)
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

// Below are my HTTP requests - these are just endpoints (or routes)
// The structure is: app.METHOD(PATH, HANDLER)
// Remember that 'app' is just an instance of express()

// CREATE - POST - Allow new users to register (i.e. add new user)) - note, no authentication parameter in this endpoint/route
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password); //hash any password entered by the user when registering before storing it in the MongoDB database
  Users.findOne({ Username: req.body.Username }) //first check if a user with the requested username already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists'); //send response if user already exists (and do not create a duplicate user)
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword, //assigning and storing the newly created hashedPassword, instead of the actual user-submitted password
            Email: req.body.Email,
            BirthDate: req.body.BirthDate
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => { //in case any other error is encountered during the POST attempt, return the error msg
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//UPDATE - PUT - update user info -by username-
app.put('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      BirthDate: req.body.BirthDate
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
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
      { $pull: { FavoriteMovies: req.params.movieid }
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
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

// READ - GET - return a list of ALL movies in the myFlix database
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(200).send('Error: ' + err);
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

// listen for requests on port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.'); //always make sure this line is printed to the terminal before testing requests, otherwise your app is not running (listening)
});
