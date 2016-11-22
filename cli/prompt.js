var prompt = require('prompt');

// 
// Start the prompt 
// 
prompt.start();

// 
// Get two properties from the user: username and password 
// 
prompt.get([{
  name: 'username',
  pattern: /^[a-zA-Z\s\-]+$/,
  message: 'Name must be only letters, spaces, or dashes',
  required: true
}, {
  name: 'password',
  hidden: true,
  replace: '*',
  conform: function (value) {
    return true;
  }
}], function (err, result) {
  console.log('Command-line input received:');
  console.log('  username: ' + result.username);
  console.log('  password: ' + result.password);
});
