'use strict';

const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/myproject',
  collectionName = 'movies';

var insertMovies = function (db, callback) {
  // Get the Movies collection
  var collection = db.collection(collectionName);
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

var listMoveis = function (db, callback) {
  // Get the documents collection
  var collection = db.collection(collectionName);
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var findMovies = function (db, callback) {
  // Get the documents collection
  var collection = db.collection(collectionName);
  // Find some documents
  collection.find({
    'name': 'Jumanji'
  }).toArray((err, docs) => {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}

var updateMovie = function (db, callback) {
  // Get the documents collection
  var collection = db.collection(collectionName);
  collection.updateOne({
    'name': 'Jumanji'
  }, {
    $set: {
      'genres': 'Adventure|Fantasy'
    }
  }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field name equal to Jumanji");
    callback(result);
  });
}

var removeMovie = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(collectionName);
  // Insert some documents
  collection.deleteOne({ name : 'The American President' }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Removed the document');
    callback(result);
  });    
}

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  insertMovies(db, () => {
    listMoveis(db, () => {
      findMovies(db, () => {
        updateMovie(db, () => {
          removeMovie(db, () => {
            listMoveis(db, () => {
              db.close();
            });
          });
        });
      });
    });
  });
});
