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
    favoriteMovies: []
  }
  ,
  {
    id: 2,
    name: "Gloria",
    favoriteMovies: ["Melancholia"]
  },
  {
    id: 3,
    name: "David",
    favoriteMovies: ["Scarface", "Requiem for a Dream"]
  }
];

let topMovies = [
  {
    title: 'Awesome Movie 1',
    genre: 'Genre 1',
    director: 'Director 1',
    yearReleased: 'Year 1'
  },
  {
    title: 'Awesome Movie 2',
    genre: 'Genre 2',
    director: 'Director 2',
    yearReleased: 'Year 2'
  },
  {
    title: 'Awesome Movie 3',
    genre: 'Genre 3',
    director: 'Director 3',
    yearReleased: 'Year 3'
  },
  {
    title: 'Awesome Movie 4',
    genre: 'Genre 4',
    director: 'Director 4',
    yearReleased: 'Year 4'
  },
  {
    title: 'Awesome Movie 5',
    genre: 'Genre 5',
    director: 'Director 5',
    yearReleased: 'Year 5'
  },
  {
    title: 'Awesome Movie 6',
    genre: 'Genre 6',
    director: 'Director 6',
    yearReleased: 'Year 6'
  },
  {
    title: 'Awesome Movie 7',
    genre: 'Genre 7',
    director: 'Director 7',
    yearReleased: 'Year 7'
  },
  {
    title: 'Awesome Movie 8',
    genre: 'Genre 8',
    director: 'Director 8',
    yearReleased: 'Year 8'
  },
  {
    title: 'Awesome Movie 9',
    genre: 'Genre 9',
    director: 'Director 9',
    yearReleased: 'Year 9'
  },
  {
    title: 'Awesome Movie 10',
    genre: 'Genre 10',
    director: 'Director 10',
    yearReleased: 'Year 10'
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

// CREATE (POST)
app.post('/users', (req, res) => {
  const newUser = req.body //the body-parser package is what allows this line to work

  //check to make sure the new user object has a name
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('please enter a name for the user');
  }
})

// GET requests - these are endpoints (or routes)
// The structure is: app.METHOD(PATH, HANDLER)
// 'app' is an instance of express()
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

//return a list of all movies to the user
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

//return data (description, genre, director, image URL, featured-or-not) about a movie -by title-
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

//return data about a genre (description) -by genre name/title- (e.g., "Horror")
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

//return data about a director (bio, birth year, death year) -by name-
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

//error handling - must come last in chain of middleware but before app.listen()
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong - oh no!');
});

// listen for requests on port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
