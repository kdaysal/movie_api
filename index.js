//Utilize Express framework for this app
const express = require('express');
const app = express();

let topMovies = [
  {
    title: 'Awesome Movie 1',
    director: 'Director 1',
    yearReleased: 'Year 1'
  },
  {
    title: 'Awesome Movie 2',
    director: 'Director 2',
    yearReleased: 'Year 2'
  },
  {
    title: 'Awesome Movie 3',
    director: 'Director 3',
    yearReleased: 'Year 3'
  },
  {
    title: 'Awesome Movie 4',
    director: 'Director 4',
    yearReleased: 'Year 4'
  },
  {
    title: 'Awesome Movie 5',
    director: 'Director 5',
    yearReleased: 'Year 5'
  },
  {
    title: 'Awesome Movie 6',
    director: 'Director 6',
    yearReleased: 'Year 6'
  },
  {
    title: 'Awesome Movie 7',
    director: 'Director 7',
    yearReleased: 'Year 7'
  },
  {
    title: 'Awesome Movie 8',
    director: 'Director 8',
    yearReleased: 'Year 8'
  },
  {
    title: 'Awesome Movie 9',
    director: 'Director 9',
    yearReleased: 'Year 9'
  },
  {
    title: 'Awesome Movie 10',
    director: 'Director 10',
    yearReleased: 'Year 10'
  }
];

// GET requests - these are endpoints (or routes)
// The structure is: app.METHOD(PATH, HANDLER)
// 'app' is an instance of express()
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! - a web application to provide users with information about various movies, directors, genres, and more!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use(express.static('public')); //serves static files from the 'public' folder

// listen for requests on port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});