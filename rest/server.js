'use strict';
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Routes = require('./routes.js');


const server = new Hapi.Server();
server.connection({
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Thank you for using our API!');
  }
});

Routes.forEach(item => {
  console.log(item);
  server.route(item);
});

const options = {
  info: {
    'title': 'Test API Documentation',
    'version': '1.0.0'
  }
};


server.register([Inert,
  Vision, {
    'register': HapiSwagger,
    'options': options
  }, {
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            log: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  }
], (err) => {

  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
