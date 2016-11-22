'use strict';

const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/myproject';

var insertMovies = function (db, callback) {
  // Get the Movies collection
  var collection = db.collection('movies');
  // Insert some documents
  collection.insertMany([{
    name: 'Toy Story',
    genres: 'Adventure|Animation|Children|Comedy|Fantasy'
  }, {
    name: 'Jumanji',
    genres: 'Adventure|Children|Fantasy'
  }, {
    name: 'Grumpier Old Men',
    genres: 'Comedy|Romance'
  }, {
    name: 'The American President',
    genres: 'Comedy|Drama|Romance'
  }], (err, result) => {
    assert.equal(err, null);
    assert.equal(4, result.result.n);
    assert.equal(4, result.ops.length);
    console.log(['Inserted ', result.ops.length, ' documents into the Movies collection'].join(''));
    callback(result);
  });
}

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  
  insertMovies(db, () => {
    db.close();
  });
});
