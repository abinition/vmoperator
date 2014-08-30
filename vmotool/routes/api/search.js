var config    = require('../../config/' + process.env.NODE_ENV + ".json"),
    api       = require('binteo')({ url: config.host, key: "foobar" }),
    intercom  = require('node-intercom').app(config.intercom),
    helpers   = require('../../lib/helpers'),
    mock;

/*
 * Feed:
 *  - get
 */
module.exports = {
  typeahead: function (req, rsp) {
    var params = {
      query: req.query.query
    }
    api.get("/search.json/typeahead", params, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  search: function (req, rsp) {
    var params = {
      limit: req.query.limit||10
    }
    if (req.query.cursor) params.cursor = req.query.cursor;
    api.get("/account.json/" + req.session.account_id + "/newsfeed", req.session.token, params, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  }
};