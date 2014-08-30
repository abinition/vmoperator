var config    = require('../../config/' + process.env.NODE_ENV + ".json"),
    api       = require('binteo')({ url: config.host, key: "foobar" }),
    intercom  = require('node-intercom').app(config.intercom),
    helpers   = require('../../lib/helpers');

/*
 * Feed:
 *  - get
 */
module.exports = {
  create: function (req, rsp) {
    var postData,
        url = "/account.json/" + req.session.account_id + "/posts",
        intercomPostType;

    postData = {
      description: req.body.description,
      topics: req.body.topics
    };
    

    if (req.body.postType == "image") {
      postData.uploadUUID = req.body.uploadUUID;
      url = "/account.json/" + req.session.account_id + "/mediaPosts";
      intercomPostType = 'create_image_post';
    } else if (req.body.postType == "video") {
      postData.uploadUUID = req.body.uploadUUID;
      url = "/account.json/" + req.session.account_id + "/videoPosts";
      intercomPostType = 'create_video_post';
    }

    api.post(url, req.session.token, postData, function (status, body) {
      var intercomData = {};
      intercomData['user_id'] =  req.session.account_id;
      intercomData['custom_data'] = {}
      intercomData.custom_data[intercomPostType] = true;

      intercom.users.post(intercomData, function(){
        rsp.status(status);
        rsp.send(body);
      });
    });
  },
  show: function (req, rsp) {
    var post_id = req.params.post_id;
    api.get("/post.json/" + post_id, req.session.token, {}, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  delete: function (req, rsp) {  
    var post_id = req.params.post_id;
    api.delete("/post.json/" + post_id, req.session.token, {}, function (status, body) {
      intercom.users.post({user_id: req.session.account_id, custom_data: {'delete_post': true}}, function(){
        rsp.status(status);
        rsp.send(body);
      });
    });
  },
  like: function (req, rsp) {
    var likeData = {
      entityType: 'post',
      id: req.params.post_id
    };
    api.post("/account.json/" + req.session.account_id + "/likes", req.session.token, likeData, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  unlike: function (req, rsp) {
    var likeData = {
      entityType: 'post',
      id: req.params.post_id
    };

    api.delete("/account.json/" + req.session.account_id + "/likes", req.session.token, likeData, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  bookmark: function (req, rsp) {
    var bookmarkData = {
      entityType: 'post',
      id: req.params.post_id
    };
    api.post("/account.json/" + req.session.account_id + "/favorites", req.session.token, bookmarkData, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  unbookmark: function (req, rsp) {
    var bookmarkData = {
      entityType: 'post',
      id: req.params.post_id
    };
    api.delete("/account.json/" + req.session.account_id + "/favorites", req.session.token, bookmarkData, function (status, body) {
      rsp.status(status);
      rsp.send(body);
    });
  },
  comments: {
    create: function (req, rsp) {
      var data = {
        message: req.body.message
      };
      api.post("/account.json/" + req.session.account_id + "/post/" + req.params.post_id + "/comments", req.session.token, data, function (status, body) {
        intercom.users.post({user_id: req.session.account_id, custom_data: {'posted_comment': true}}, function(){
          rsp.status(status);
          rsp.send(body);
        });
      });
    },
    delete: function (req, rsp) {
      api.delete("/account.json/" + req.session.account_id + "/post/" + req.params.post_id + "/comment/" + req.params.id, req.session.token, {}, function (status, body) {
        rsp.status(status);
        rsp.send(body);
      });
    }
  }
};