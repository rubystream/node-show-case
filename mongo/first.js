'use strict';

const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});
