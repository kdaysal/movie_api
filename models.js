/**
* Mongoose is an ODM (Object Document Mapper) that I am using with
* my MongoDB document architecture for the purpose of enforcing
* uniformity in my data via specified models from the application-side 
* to ensure that all data follows a specified format.
*/

const mongoose = require('mongoose'), //mongoose is an ORM (Object Document Mapper) which I'm using to enforce uniformity via specified models in my data from the application-side
  bcrypt = require('bcrypt'); //this is a Node.js module used to hash users' passwords and compare hashed passwords every time users log in

/**
* This section defines the schemas for my 'Movies' and 'Users' collections
* 'Movies' will house all data related to the movies (title, description, genre, etc)
* 'Users' will house all data related to the user's profile (name, dob, password, etc)
*/
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  BirthDate: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] //this FavoriteMovies array is ensuring (via reference) that the 'type' is = the 'type' of ObjectID as defined in my 'Movie' model
});

//this performs the actual hashing of a user-submitted password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

//this compares the submitted hashed passwords with the hashed passwords already stored in the db
userSchema.methods.validatePassword = function (password) { //here I'm not using arrow function syntax because if I did, the 'this' would be bound to the object that owns the function (in this case, 'userSchema.methods', rather than the intended 'user')
  return bcrypt.compareSync(password, this.Password);
};

//defining the models which link the movieSchema and userSchema to their database collections
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//export the models so I can import them into my index.js file
module.exports.Movie = Movie;
module.exports.User = User;