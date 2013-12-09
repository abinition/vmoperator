/*
 * Serve JSON to our AngularJS client
 */

// GET

exports.gem = function (req, res) {
  /*
  var req_secs = handlers.http.request ( {
	host: '192.168.11.103',
	port: 8085,
	path: '/gem/1/1',
	method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  },
  function(res) {
    var output = '';
    console.log(options.host + ':' + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function() {
      var obj = JSON.parse(output);
      onResult(res.statusCode, obj);
    });
  });
  */
  res.json({
    gem: "Gem Message"
  });

};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};
