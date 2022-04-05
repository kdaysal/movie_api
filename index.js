//require the Mongoose package and models.js file
const mongoose = require('mongoose');
const Models = require('./models.js');

//these variables refer to the model names as defined in the models.js file
const Movies = Models.Movie;
const Users = Models.User;

//leaving my db name as the default 'test' for now
//this allows Mongoose to connect to the db to perform CRUD operations on its documents from within my REST API
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

//Utilize Express framework for this app
const express = require('express'),
  morgan = require('morgan'), //custom middleware for loging request details to log.txt
  bodyParser = require('body-parser'), //middleware for error-handling
  methodOverride = require('method-override'), //middleware for error-handling
  uuid = require('uuid');
const res = require('express/lib/response');

const app = express();

app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());



app.use(express.static('public')); //serves static files from the 'public' folder

// HTTP requests - these are just endpoints (or routes)
// The structure is: app.METHOD(PATH, HANDLER)
// 'app' is an instance of express()

// CREATE - POST - Allow new users to register (i.e. add new user))
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//UPDATE - PUT - update user info -by username-
app.put('/users/:username', (req, res) => {
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
app.post('/users/:username/movies/:movieid', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, {
     $push: { FavoriteMovies: req.params.movieid }
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

//DELETE - Allow users to remove a movie from their list of favorites -by movie name-
app.delete('/users/:username/movies/:movieid', (req, res) => {
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
app.delete('/users/:username', (req, res) => {
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
//DELETE ALL OF THE BELOW CODE BLOCK ONCE THE ABOVE ^ HAS BEEN REFACTORED AND TESTED
//DELETE - Allow existing users to deregister from myFlix - by id-
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;//pulling multiple parameters from the url

//   let user = users.find(user => user.id == id);

//   if (user) {
//     users = users.filter(user => user.id != id); //comparing string to a number, do not use strict equality here
//     res.status(200).send(`user ${id} has been deregistered from myFlix`);
//   } else {
//     res.status(400).send('no such user exists, sorry!');
//   }
// });

//READ - GET - Show home directory content
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

// READ - GET - return a list of ALL movies in the myFlix database
app.get('/movies', (req, res) => {
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
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - GET - return data about a genre -by genre name-
app.get('/movies/genres/:genre', (req, res) => {
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
app.get('/movies/directors/:name', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
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
  console.log('Your app is listening on port 8080.');
});
