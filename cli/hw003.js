'use strict';

/**
 * Using the http://www.omdbapi.com/ find the Genre for movies without the genre for each movie form previously generated file in HW002.
 * The request should resemble to the following:
 * $ curl -X GET http://www.omdbapi.com/?t=Marco+Polo%3A+One+Hundred+Eyes&y=2015&plot=short&r=json
 * where parameters of the request are as :
 *   t - Movie title to search for.
 *   y - Year of release.
 *   plot - Return short or full plot.
 *   r - The data type to return.
 *
 * and it will produce the result like:
 * { "Title":"Marco Polo: One Hundred Eyes", "Year":"2015", "Rated":"N/A", "Released":"26 Dec 2015", "Runtime":"30 min", "Genre":"Short, Action, Drama", "Director":"Alik Sakharov", "Writer":"John Fusco (creator), John Fusco", "Actors":"Tom Wu, Lorenzo Richelmy, Olivia Cheng, Claudia Kim", "Plot":"Before he lost his sight. Before he pledged his service to Kublai Khan. Hundred Eyes saw what made him into the deadly assassin who trains Marco Polo.", "Language":"English", "Country":"USA", "Awards":"1 nomination.", "Poster":"http://ia.media-imdb.com/images/M/MV5BMjA1OTgxMTIyMl5BMl5BanBnXkFtZTgwNDA1MTM0NzE@._V1_SX300.jpg", "Metascore":"N/A", "imdbRating":"7.9", "imdbVotes":"3,206", "imdbID":"tt5235348", "Type":"movie", "Response":"True" }
 *
 * Generate file updateToMoviesWithoutGenre.csv
 **/

const fs = require('fs');
const csv = require('fast-csv');
const request = require('request');

// main program :-)
var stream = fs.createReadStream('./withoutGenreMovies.csv');
var csvParseOptions = {
  delimiter: ',',
  headers: true,
  ignoreEmpty: true,
  trim: true
};

var writeCsvStream = csv.createWriteStream({
    headers: true
  }),
  writableStream = fs.createWriteStream('./updateToMoviesWithoutGenre.csv');

writableStream.on('finish', () => {
  console.log('DONE!');
});

writeCsvStream.pipe(writableStream);

var reqs = 0,
  noMoreData = false;

var csvStream = csv(csvParseOptions)
  .on('data', (data) => {
    // console.log(data);
    var movieTitle = data.title;
    var year = null;
    var sYear = movieTitle.lastIndexOf('(');
    if (sYear > 0) {
      var eYear = movieTitle.lastIndexOf(')');
      year = movieTitle.substring(sYear + 1, eYear);
      movieTitle = movieTitle.substring(0, sYear);
    }

    reqs++;

    var url = 'http://www.omdbapi.com/?plot=short&r=json&t=' + movieTitle + (year ? '&y=' + year : '');
    request.get(url, (error, response, body) => {

      if (!error && response.statusCode == 200) {
        try {
          var omdbapiData = JSON.parse(body);
          if (omdbapiData.Genre) {
            data.genres = omdbapiData.Genre.split(', ').join('|');
            console.log(data.title, ' - ', data.genres);
          }
          writeCsvStream.write(data);
        } catch (e) {
          console.log(e);
        }
      }
      reqs--;
      if (noMoreData && reqs === 0) {
        writeCsvStream.end();
      }
    });
  })
  .on('error', (e) => {
    console.log('Error', e);
  })
  .on('end', () => {
    noMoreData = true;
    console.log('Done reading file.');
  });

stream.pipe(csvStream);
