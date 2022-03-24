//Utilize Express framework for this app
const express = require('express'),
  morgan = require('morgan'), //custom middleware for loging request details to log.txt
  bodyParser = require('body-parser'), //middleware for error-handling
  methodOverride = require('method-override'); //middleware for error-handling

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
      "birth year":1943 
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
      "birth year":1943 
    },
    "imageURL": "https://en.wikipedia.org/wiki/Martin_Campbell#/media/File:Martin_Campbell.jpg",
    "featured": true
  }
]

app.use(express.static('public')); //serves static files from the 'public' folder

// GET requests - these are endpoints (or routes)
// The structure is: app.METHOD(PATH, HANDLER)
// 'app' is an instance of express()
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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