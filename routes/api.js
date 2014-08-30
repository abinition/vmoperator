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

exports.init = 
"-m -100x100x0x0 " ;//-m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m -100x100x0x0 -m 100x-52x0x0 -m 90x0x1x0"
exports.buffer = exports.init ;

exports.step = function (req, res) {
  console.log(req.body);
  res.json( "OK" );
};

exports.kvm = function (req, res) {
    res.send( module.exports.buffer );
	module.exports.buffer = "na na" ;
};

exports.kvminit = function (req, res) {
  module.exports.buffer = module.exports.init ;
  res.send ( module.exports.buffer ) ;
  module.exports.buffer = "na na" ; //-k 1 -t x -k 2 -t x -k 5 -t x -k Etching -t x -k 1 -t x -k 1 -t x -k Sputtering -t x -k 1 -t x -k 1 -t x -k ABCDEFGHIJKLMNOPQRSTUZ -t x -k 1 -t x -k 8 -t x -k abcdefghijqlmnopqrstuvwxyz -t x -k 1 -t x -k 1 -t x -k  -t x -k 1 -t x -k 6 -t x -k NoProcess -t x -k 1 -t x -k 1 -t x -k Etching -t x -k 1 -t x -k 3 -t x -k Sputtering -t x -k 1 -t x -k 18 -t x -k NoProcess -t x -k 1 -t x -k 1 -t x -k NoProcess -t x -k 1 -t x -k 1 -t x -m 0x0x1x0x" ;
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
