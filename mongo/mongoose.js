'use strict';

const mongoose = require('mongoose');

// Connection URL
const url = 'mongodb://localhost:27017/myproject';

var movieSchema = mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  genres: String
});

movieSchema.methods.genreList = function () {
  return this.genres.split('|');
};


mongoose.connect(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  // we're connected!

  var Movie = mongoose.model('Movie', movieSchema);

  Movie.find({}, (error, movies) => {
    if (error) {
      console.log(error);
    }
    if (movies) {
      console.log(movies);
      console.log('\n===========================\n');

      movies.forEach(movie => {
        console.log(movie.genreList());
      });
      console.log('\n===========================\n');
      
      Movie.find({genres: { $regex : 'Adventure'}}, (error, movies) => {
        if (error) {
          console.log(error);
        }
        if (movies) {
          console.log(movies);
        }
        
        db.close();
      });

      
    }


  });
});
