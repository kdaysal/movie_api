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