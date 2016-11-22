'use strict';
/*
 * movieId,title,genres
 * 1,Toy Story (1995),Adventure|Animation|Children|Comedy|Fantasy
 * 2,Jumanji (1995),Adventure|Children|Fantasy
 */

const fs = require('fs');
const csv = require('fast-csv');

function findTheMissingGenres(data) {
  return (!data.genres || data.genres === '(no genres listed)' ||
    data.genres === '');
}

// main program :-)
var stream = fs.createReadStream('./data/movies.csv');
var csvParseOptions = {
  delimiter: ',',
  headers: true,
  ignoreEmpty: true,
  trim: true
};

var writeCsvStream = csv.createWriteStream({
    headers: true
  }),
  writableStream = fs.createWriteStream('./withoutGenreMovies.csv');

writableStream.on('finish', () => {
  console.log('DONE!');
});

writeCsvStream.pipe(writableStream);

var csvStream = csv(csvParseOptions)
  .on('data', (data) => {

    if (findTheMissingGenres(data)) {
      writeCsvStream.write(data);
    }
  })
  .on('error', (e) => {
    console.log('Error', e);
  })
  .on('end', () => {
    writeCsvStream.end();
  });

stream.pipe(csvStream);
