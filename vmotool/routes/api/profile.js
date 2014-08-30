var config    = require('../../config/' + process.env.NODE_ENV + ".json"),
    api       = require('binteo')({ url: config.host, key: "foobar" }),
    intercom  = require('node-intercom').app(config.intercom),
    helpers   = require('../../lib/helpers'),
    request = require("request");    
/*
 * Profile:
 *  - current
 *  - update
 *
 *  - getByUsername
 *  - posts
 *  - followers
 *  - following
 *  - topics
 *  - bookmarks
 */
module.exports = {
  current: function (req, rsp) {
    if (req.session.account_id) {
      api.get("/account.json/" + req.session.account_id + "/profile", req.session.token, {}, function (status, body) {
	if (status == 200) {

	  //console.log('create xmpp session for ' + body.username + "@" + config.realtime_url);
	  var args = {
		  "method": "GET",
		  "url": config.realtime_url + "username=" + body.username + "&secret=" + req.session.account_id
	  }

	  request(args, function(e, r, body) {

		console.log('apiAuthenticate \n' + body);
	  });

	}      
        rsp.status(status);
        rsp.json(body);
      });
    } else {
      rsp.status(200);
      rsp.json({});
    }
  },
  get: function (req, rsp) {
    api.get("/account.json/" + req.params.username + "/profile", req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.json(body);
    });
  },
  update: function (req, rsp) {
    var accountData = {};
    if (req.body.name) accountData.name = req.body.name;
    if (req.body.email) accountData.email = req.body.email;
    if (req.body.phone) accountData.phone = req.body.phone;
    if (req.body.image) accountData.uploadUUID = req.body.image;
    if (req.body.location) accountData.location = req.body.location;
    if (req.body.bio) accountData.bio = req.body.bio;
    if (req.body.dateOfBirth) accountData.dateOfBirth = req.body.dateOfBirth;
    if (req.body.password) accountData.password = req.body.password;

    api.put("/account.json/" + req.session.account_id + '/profile', req.session.token, accountData, function(status, body){
      var avatarData;
      if (req.body.avatar) {
        avatarData = {
          uploadUUID: req.body.avatar
        }
        api.put("/account.json/" + req.session.account_id + "/avatar", req.session.token, avatarData, function(status, body){
          rsp.status(status)
          rsp.send(body);
        })
      } else {
        rsp.status(status);
        rsp.send(body);
      }
    });
  },
  posts: function (req, rsp) {
    var params = {
      limit: req.query.limit||10
    }
    if (req.query.cursor) params.cursor = req.query.cursor;
    if (req.session.token) {
      api.get("/account.json/" + req.params.account_id + "/posts", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/account.json/" + req.params.account_id + "/posts", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  followers: function (req, rsp) {
    var params = {
      limit: req.query.limit||10,
      version: 1
    }
    if (req.query.cursor) params.cursor = req.query.cursor;    
    if (req.session.token) {
      api.get("/account.json/" + req.params.account_id + "/followers", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/account.json/" + req.params.account_id + "/followers", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  following: function (req, rsp) {
    var params = {
      limit: req.query.limit||10,
      version: 1
    }
    if (req.query.cursor) params.cursor = req.query.cursor;
    if (req.session.token) {
      api.get("/account.json/" + req.params.account_id + "/follows", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/account.json/" + req.params.account_id + "/follows", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  topics: function (req, rsp) {
    var params = {
      limit: req.query.limit||10
    }
    if (req.query.cursor) params.cursor = req.query.cursor;
    if (req.session.token) {
      api.get("/account.json/" + req.params.account_id + "/topics", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/account.json/" + req.params.account_id + "/topics", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  follow: function (req, rsp) {
    var account_id = req.params.account_id;
    api.post("/account.json/" + req.session.account_id + "/follow/account/" + account_id, req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  unfollow: function (req, rsp) {
    var account_id = req.params.account_id;
    api.delete("/account.json/" + req.session.account_id + "/follow/account/" + account_id, req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  }
};