var config    = require('../../config/' + process.env.NODE_ENV + ".json"),
    api       = require('binteo')({ url: config.host, key: "foobar" }),
    intercom  = require('node-intercom').app(config.intercom),
    helpers   = require('../../lib/helpers');

/*
 * Feed:
 *  - get
 */
module.exports = {
  show: function (req, rsp) {
    var slug = req.params.slug;
    api.get("/topic.json/" + slug, req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  posts: function (req, rsp) {
    var slug    = req.params.slug,
        params  = {
          limit: req.query.limit||10
        };
    if (req.query.cursor) params.cursor = req.query.cursor;
    if (req.session.token) {
      api.get("/topic.json/" + slug + "/posts", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/topic.json/" + slug + "/posts", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  followers: function (req, rsp) {
    var slug = req.params.slug,
        params = {
          limit: req.query.limit||10
        };
    if (req.query.cursor) params.cursor = req.query.cursor;    
    if (req.session.token) {
      api.get("/topic.json/" + slug + "/followers", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/topic.json/" + slug + "/followers", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  experts: function (req, rsp) {
    var slug = req.params.slug,
        params = {
          limit: req.query.limit||10
        };;
    if (req.query.cursor) params.cursor = req.query.cursor;    
    if (req.session.token) {
      api.get("/topic.json/" + slug + "/experts", req.session.token, params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    } else {
      api.get("/topic.json/" + slug + "/experts", params, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  },
  follow: function (req, rsp) {
    var topic_slug = req.params.slug;
    api.post("/account.json/" + req.session.account_id + "/follow/topic/" + topic_slug, req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  unfollow: function (req, rsp) {
    var topic_slug = req.params.slug;
    api.delete("/account.json/" + req.session.account_id + "/follow/topic/" + topic_slug, req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  }
};