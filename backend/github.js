const request = require('request');
const purest = require('purest')({request, promise: Promise});
const providers = require('@purest/providers');

const githubApi = purest({
  provider: 'github',
  config: providers,
  defaults: {
  headers: {
    "User-Agent": 'ekkiog'
  }
}});

module.exports.getUser = function(token){
  return githubApi
    .get('user')
    .auth(token)
    .request();
}