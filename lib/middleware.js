var request     = require('request')
var formidable  = require("formidable")
var qs          = require("qs")
var fs          = require("fs")
var config      = require('../config/' + process.env.NODE_ENV + ".json")
var helpers     = require('../lib/helpers')
//var intercom = require('node-intercom').app(config.intercom);
var api         = require('../hs/hs')({ url: config.host, key: "foobar" },request,qs,fs)

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV == 'development') {
  request = request.defaults({
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  });
}


exports.redirect = function(req, rsp, next){
  if(req.session.account_id && req.session.token){
    rsp.redirect("/profile")
  }else{
    // make sure we are clear
    req.session.account_id = null
    req.session.token = null
    next()
  }
}

exports.auth = function(req, rsp, next){
  if(req.session.account_id && req.session.token){
    next()
  }else{
    req.session.return_url = req.url
    // clear session
    req.session.account_id = null
    req.session.token = null
    rsp.statusCode = 403
    rsp.send("Authenticated Required")
    //rsp.render("login", { layout: "layouts/unauthorized", errors: [] })
  }
}

exports.authenticate = function(req, rsp, next){
  if(req.session.account_id && req.session.token){
    next()
  }else{
    req.session.return_url = req.url
    // make sure we are clear
    req.session.account_id = null
    req.session.token = null
    rsp.render("login", { layout: "layouts/unauthorized", errors: [] })
  }
}

exports.apiAuthenticate = function(req, rsp, next){
  if (req.session.account_id && req.session.token) {
    next();

    console.log('check authentication for ' + req.session.account_id);

    api.get("/account.json/" + req.session.account_id + "/profile", req.session.token, {}, function (status, body) {
      var args;
      if (status == 200) {
        console.log('create xmpp session for ' + body.username);
        args = {
          "method": "GET",
          "url": config.realtime_url + "username=" + body.username + "&secret=" + req.session.account_id
        }
        request(args, function(e, r, body) {
          console.log('apiAuthenticate \n' + body);
        });
      }
    });
  } else {
    // make sure we are clear
    req.session.account_id = null;
    req.session.token = null;
    rsp.status(403);
    rsp.send({
      errors: ["You must login first"]
    });
  }
}

exports.profile = function (req, rsp, next){
  if (req.session && req.session.token) {
    api.get("/account.json/" + req.session.account_id + "/profile", req.session.token, {}, function (status, body) {
      if (status != 200) {
        req.session.authenticated = false;
        next(new Error(status));
      } else {
        req.session.authenticated = true;
        if (!body.phone) body.phone = "";
        if (!body.images) {
          body.images = {
            xs: "/img/profile-default-image-f.png",
            s: "/img/profile-default-image-f.png",
            m: "/img/profile-default-image-f.png",
            l: "/img/profile-default-image-f.png",
            f: "/img/profile-default-image-f.png",
          };
        }
        req.profile = body;
        next();
      }
    })
  } else {
    req.profile = null;
    req.session.account_id = null;
    req.session.token = null;
    req.session.authenticated = false;
    next();
  }
}

exports.networks = function (req, rsp, next){
  api.get("/networks.json", null, {}, function (status, body) {
    if (status !== 200) {
      var errors = helpers.parseErrors(body);
      rsp.send(status, { errors: errors });
    } else {
      req.networks = body;
      next();
    }
  });
}

exports.action = function(req, rsp, next){
  req.action = "none";
  req.networks.forEach(function (network) {
    var network_url, group_url, experts_url;

    network_url = "/" + network.slug;
    group_url = "/" + network.slug + "/groups";
    experts_url = "/" + network.slug + "/experts";
    if (req.url.indexOf(network_url) !== -1) {
      req.action = "activity";
    }
    if (req.url.indexOf(group_url) !== -1) {
      req.action = "groups";
    }
    if (req.url.indexOf(experts_url) !== -1) {
      req.action = "experts";
    }
  });
  next();
}

exports.login = function(req, rsp, next) {
  api.get("/accounts.json/login", { username: req.body.username, password: req.body.password }, function (status, body) {
    // We have a valid session
    if (status == 200) {
      req.session.account_id = body.id;
      req.session.token = body.token;
      next();
    } else {
      if(req.xhr) {
        rsp.status(401);
        rsp.end("Incorrect username or password.");
      } else {
        rsp.render("login", {
          creds: {
            username: req.body.username,
            password: req.body.password,
          },
          layout: "layouts/unauthorized",
          errors: ["Incorrect username or password."]
        });
      }
    }
  });
}

exports.apiLogin = function (req, rsp, next) {
  var credentials = {
    username: req.body.username,
    password: req.body.password
  };

  api.get("/accounts.json/login", credentials, function (status, body) {
    // We have a valid session
    if (status == 200) {
      req.session.account_id = body.id;
      req.session.token = body.token;

      rsp.status(200);
      rsp.end();
    } else {
      rsp.status(401);
      rsp.end("Incorrect username or password.");
    }
  });
}

exports.apiLogout = function (req, rsp, next) {
  req.profile = null;
  req.session.account_id = null;
  req.session.token = null;
  req.session.authenticated = false;
  rsp.status(200);
  rsp.end();
}

exports.apiSignup = function (req, rsp, next) {
  if (!req.body.acceptToS) {
    rsp.status(400);
    rsp.json({ "errors": ["You must accept our Terms and Conditions before signing up"] });
  } else {
    req.body.confirmPassword = req.body.password;
    api.post("/accounts.json/registration", req.body, function (status, body){
      if (status == 201 || status == 200) {
/*
        intercom.users.post({
          created_at: (new Date() / 1000),
          user_id: body.id,
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
        ***/

        req.session.account_id  = body.id;
        req.session.token       = body.token;

        if (req.body.selectedNetworks) {
          var selectedNetworks = req.body.selectedNetworks.split(',');
          var count = 0;
          selectedNetworks.forEach(function (networkId) {
            api.post("/account.json/" + body.id + "/entity/network/" + networkId, body.token, {}, function() {
              count++;
              if (count === selectedNetworks.length) {
                req.networks.forEach(function(e,i,a){
                  if (e._id === selectedNetworks[0]) {
                    rsp.redirect("/" + e.slug);
                  }
                });
              }
            });
          });
        } else {
          rsp.status(200);
          rsp.end();
        }
      } else {
        var errors = helpers.parseErrors(body);
        rsp.status(400);
        rsp.json({ "errors": errors });
      }
    });
  }
}

exports.multipart = function(req, options, next) {

  var form = new formidable.IncomingForm(),
    data = {},
    files = {},
    done;

  Object.keys(options).forEach(function(key){
    form[key] = options[key];
  });

  function ondata(name, val, data){
    if (Array.isArray(data[name])) {
      data[name].push(val);
    } else if (data[name]) {
      data[name] = [data[name], val];
    } else {
      data[name] = val;
    }
  }

  form.on('field', function(name, val){
    ondata(name, val, data);
  });

  // This is emitted on end of file
  form.on('file', function(name, val){
    files[name] = val;
    ondata(name, val, data);
  });

  form.on('error', function(err){
    next(err);
    done = true;
  });

  form.on('end', function(){
    if (done) return; // error
    req.files = [];

    var counter = 0;
    for (name in files) {
      api.upload(name, files[name], function(status, body){
        if (status === 200) {
          counter++;

          // TODO, we could support more files but the front-end will need different results.
          req.uploadedFile = body;
          req.files.push(files);

          if (counter == Object.keys(files).length) {
            next();
          }
        } else {
          next(body);
        }
      });
    };

  });
  form.parse(req);
};
