'use strict';

const requester = require('request');
const Joi = require('joi');

var urlFactory = function (url) {
  return ['/api', 'v1', url].join('/');
};

module.exports = [{
  method: 'GET',
  path: urlFactory(''),
  config: {
    description: 'Return the API version',
    tags: ['api'],
    handler: function (request, reply) {
      reply({
        result: {
          version: '1.0.0'
        }
      });
    }
  }
}, {
  method: 'GET',
  path: urlFactory('movies/'),
  config: {
    description: 'Get movies or if query q parameter is used perform search on a movie title field',
    notes: 'Returns a movie items for 2016 year only',
    tags: ['api'],
    handler: function (request, reply) {
      var keyword = request.query.q ? encodeURIComponent(request.query.q) : 'The';
      console.log(request.query);
      console.log(keyword);
      return requester.get('http://www.omdbapi.com/?type=movie&y=2016&s=' + keyword, (error, response, body) => {
        reply(body);
      });
    }
  }
}, {
  method: 'POST',
  path: urlFactory('movies/'),
  config: {
    description: 'Get movies or if query q parameter is used perform search on a movie title field',
    notes: 'Returns a movie items for 2016 year only',
    tags: ['api'],
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        genres: Joi.string().required()
      })
    },
    handler: function (request, reply) {
      var newItem = request.payload;
      console.log(newItem);

      return reply(newItem)
        .code(201)
        .message('User Saved Successfully');
    }
  }
}];
