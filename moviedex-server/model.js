let mongoose = require( 'mongoose' );
let uuid = require( 'uuid/v4' );

mongoose.Promise = global.Promise;


let movieSchema = mongoose.Schema({
    film_ID: uuid,
    film_title: String,
    year: Number,
    rating: Number
});


let movies = mongoose.model("movies",movieSchema);
  
let movieController = {
    getAll: function() {
      return movies.find()
        .then(mvs => {
          return mvs;
        })
        .catch(err => {
          throw new Error(err);
        });
    },
    create: function(newMovie) {
        return movies.create(newMovie)
          .then(mv => {
            return mv;
          })
          .catch(error => {
            throw new Error(error);
          });
    }
};

  

module.exports = {
   movieController
};