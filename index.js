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

let users = [
  {
    id: 1,
    name: "David",
    username: "dvid123",
    favoriteMovies: []
  }
  ,
  {
    id: 2,
    name: "Gloria",
    username: "glory123",
    favoriteMovies: ["Melancholia"]
  },
  {
    id: 3,
    name: "David",
    username: "otherDavid",
    favoriteMovies: ["Scarface", "Requiem for a Dream"]
  }
];

let movies = [
  {
    "title": "My Cousin Vinny",
    "description": "-PLACEHOLDER- Description of the movie.",
    "genre": {
      "name": "Comedy",
      "description": "a play, movie, etc., of light and humorous character with a happy or cheerful ending"
    },
    "director": {
      "name": "Jonathan Lynn",
      "bio": "Jonathan Lynn (born 3 April 1943) is an English stage and film director, producer, writer, and actor. He is known for directing comedy films such as Clue (1985), Nuns on the Run (1990), My Cousin Vinny (1992) and The Whole Nine Yards (2000). He co-created and co-wrote the television series Yes Minister (1980–1984, 2013) and Yes, Prime Minister (1986–1988).",
      "birth year": 1943
    },
    "imageURL": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/nk5XnrehDowm5Q5Wr8hsObiD6C1.jpg",
    "featured": false
  },
  {
    "title": "GoldenEye",
    "description": "GoldenEye is a 1995 spy film, the seventeenth in the James Bond series produced by Eon Productions, and the first to star Pierce Brosnan as the fictional MI6 agent James Bond. It was directed by Martin Campbell and is the first in the series not to utilize any story elements from the works of novelist Ian Fleming.",
    "genre": {
      "name": "Action Thriller",
      "description": "A thriller is a book, film, or play that tells an exciting fictional story about something such as criminal activities or spying."
    },
    "director": {
      "name": "Martin Campbell",
      "bio": "Martin Campbell (born 24 October 1943) is a New Zealand film and television director based in the United Kingdom. He directed the British miniseries Edge of Darkness (1985), for which he won a BAFTA, The Mask of Zorro (1998), and the James Bond films GoldenEye (1995) and Casino Royale (2006).",
      "birth year": 1943
    },
    "imageURL": "https://en.wikipedia.org/wiki/Martin_Campbell#/media/File:Martin_Campbell.jpg",
    "featured": true
  }
]

app.use(express.static('public')); //serves static files from the 'public' folder

// CREATE - POST - Allow new users to register)
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
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
            Birthday: req.body.Birthday
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

//UPDATE - PUT - Allow users to update their existing user info (username) -by id-
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUserName = req.body;

  let user = users.find(user => user.id == id); //double equals to check equality on values only, not data type

  if (user) {
    user.username = updatedUserName.username;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such username exists, sorry!')
  }
})

//CREATE - POST - Allow users to add a movie to their list of favorites -by id- / -by movie name-
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;//pulling multiple parameters from the url

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such movie title exists, sorry!')
  }
});

//DELETE - Allow users to remove a movie from their list of favorites -by movie name-
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;//pulling multiple parameters from the url

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such movie title exists, sorry!')
  }
});

//DELETE - Allow existing users to deregister from myFlix - by id-
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;//pulling multiple parameters from the url

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id); //comparing string to a number, do not use strict equality here
    res.status(200).send(`user ${id} has been deregistered from myFlix`);
  } else {
    res.status(400).send('no such user exists, sorry!');
  }
});

// HTTP requests - these are just endpoints (or routes)
// The structure is: app.METHOD(PATH, HANDLER)
// 'app' is an instance of express()

//READ - GET - Show home directory content
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

//READ - GET - return a list of all movies to the user
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

//READ - GET - return data (description, genre, director, image URL, featured-or-not) about a movie -by title-
//this assigns whatever the user inputs after the 'movies/' to the request (req) as a parameter called 'title'
app.get('/movies/:title', (req, res) => {
  // const title = req.params.title; refactored below in { object destructuring } format
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  }
  else {
    res.status(400).send('no such movie in the database');
  }
});

//READ - GET - return data about a genre (description) -by genre name/title- (e.g., "Horror")
app.get('/movies/genre/:genreName', (req, res) => {
  // const title = req.params.title; refactored below in { object destructuring } format
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName).genre; //the '.genre' at the end of the find() method is accessing just the genre data (via dot notation)

  if (genre) {
    res.status(200).json(genre);
  }
  else {
    res.status(400).send('no such genre in the database');
  }
});

//READ - GET - return data about a director (bio, birth year, death year) -by name-
app.get('/movies/directors/:directorName', (req, res) => {
  // const title = req.params.title; refactored below in { object destructuring } format
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  }
  else {
    res.status(400).send('no such genre in the database');
  }
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
