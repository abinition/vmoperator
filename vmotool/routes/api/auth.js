var config    = require('../../config/' + process.env.NODE_ENV + ".json"),
    api       = require('binteo')({ url: config.host, key: "foobar" }),
    intercom  = require('node-intercom').app(config.intercom),
    helpers   = require('../../lib/helpers');

/*
 * Auth:
 *  - login
 *  - logout
 *  - signup
 */
module.exports = {
  login: function (req, rsp) {
    var credentials = {
      username: req.body.username,
      password: req.body.password
    };
    api.get("/accounts.json/login", credentials, function (status, body) {
      if (status == 200) {
        req.session.account_id = body.id;
        req.session.token = body.token;
        api.get("/account.json/" + req.session.account_id + "/profile", req.session.token, {}, function (status, body) {
          rsp.status(200);
          rsp.json(body);
        });
      } else {
        rsp.status(401);
        rsp.end("Incorrect username or password");
      }
    });
  },
  logout: function (req, rsp) {
    req.profile = null;
    req.session.account_id = null;
    req.session.token = null;
    req.session.authenticated = false;
    rsp.status(200);
    rsp.end();
  },
  signup: function (req, rsp) {
    if (!req.body.tos) {
      rsp.status(400);
      rsp.json({ "errors": ["You must accept our Terms and Conditions before signing up"] });
    } else {
      req.body.confirmPassword = req.body.password;
      api.post("/accounts.json/registration", req.body, function (status, body){
        if (status == 201 || status == 200) {
          intercom.users.post({
            created_at: (new Date() / 1000),
            user_id: body.id,
            email: body.email,
            custom_data: {
              "update_account": false,
              "delete_notifications": false,
              "delete_notification": false,
              "create_image_post": false,
              "create_video_post": false,
              "create_link_post": false,
              "create_text_post": false,
              "update_post": false,
              "delete_post": false,
              "posted_comment": false,
              "delete_comment": false,
              "add_friend": false,
              "delete_friend": false,
              "add_group": false,
              "update_group": false,
              "delete_group": false,
              "subscribe_group": false,
              "unsubscribe_group": false,
              "unsubscribe_network": false,
              "subscribe_network": false,
              "favourite": false,
              "delete_favourite": false,
              "like": false,
              "delete_like": false,
              "password_reset": false
            }
          }, function(){});
          req.session.account_id  = body.id;
          req.session.token       = body.token;
          api.get("/account.json/" + req.session.account_id + "/profile", req.session.token, {}, function (status, body) {
            rsp.status(200);
            rsp.json(body);
          });
        } else {
          var errors = helpers.parseErrors(body);
          rsp.status(400);
          rsp.json({ "errors": errors });
        }
      });
    }
  }
};
