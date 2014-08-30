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
  get: function (req, rsp) {
    var params = {
      limit: req.query.limit||10
    }
    if (req.query.cursor) params.cursor = req.query.cursor;
    api.get("/account.json/" + req.session.account_id + "/notifs", req.session.token, params, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  delete: function (req, rsp) {
    var url = "/account.json/" + req.session.account_id + "/notifs";
    if (req.params.id) url = "/notif.json/" + req.params.id;
    api.delete(url, req.session.token, {}, function (status, body) {
      intercom.users.post({user_id: req.session.account_id, custom_data: {'delete_notifications': true}}, function(){
        rsp.status(status);
        rsp.send(body);
      });
    });
  }
};