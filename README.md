# myFlix API!

## Main Objective

To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

## Key Features

* Return a list of ALL movies to the user

* Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user

* Return data about a genre (description) by name/title (e.g., “Thriller”)

* Return data about a director (bio, birth year, death year) by name

* Allow new users to register

* Allow users to update their user info (username, password, email, date of birth)

* Allow users to add a movie to their list of favorites

* Allow users to remove a movie from their list of favorites

* Allow existing users to deregister

## Technologies / Strategies Used

* Node.js
* Express
    * request parameters
    * body-parser module
    * uuid module
    * status codes
* Morgan (middleware library)
* Postman (endpoint testing)
* PostgreSQL (used during initial development phase, later transitioned to MongoDB)
* MongoDB
    * MongoDB Atlas 
* Mongoose
* HTTP authentication
* JWT authentication
* Passport (middleware tool)
* RESTful architecture
* CRUD functionality

## User Stories

* As a user, I want to be able to receive information on movies, directors, and genres so that I
can learn more about movies I’ve watched or am interested in.

* As a user, I want to be able to create a profile so I can save data about my favorite movies

## Technical Requirements

* The API must be a Node.js and Express application.

* The API must use REST architecture, with URL endpoints corresponding to the data
operations listed above

* The API must use at least three middleware modules, such as the body-parser package for
reading data from requests and morgan for logging.

* The API must use a “package.json” file.

* The database must be built using MongoDB.

* The business logic must be modeled with Mongoose.

* The API must provide movie information in JSON format.

* The JavaScript code must be error-free.

* The API must be tested in Postman.

* The API must include user authentication and authorization code.

* The API must include data validation logic.

* The API must meet data security regulations.

* The API source code must be deployed to a publicly accessible platform like GitHub.

* The API must be deployed to Heroku.

## Additional Mongo DB notes

* The following 2 screenshots show examples of how objects are structured in my 'Movies' and 'Users' collections in MongoDB:

<p float="left">
  <img src="https://github.com/kdaysal/movie_api/blob/main/img/1-movies-collection.png" width="300" />
  <img src="https://github.com/kdaysal/movie_api/blob/main/img/2-users-collection.png" width="300" />
</p>