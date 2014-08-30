var api = {};

api.auth    = require(__dirname + '/auth');
api.profile = require(__dirname + '/profile');
api.feed    = require(__dirname + '/feed');
api.posts   = require(__dirname + '/posts');
api.topics  = require(__dirname + '/topics');
api.search  = require(__dirname + '/search');
api.notifications  = require(__dirname + '/notifications');

exports.api = api;