var STREAM_PORT = 8082,
	WEBSOCKET_PORT =  8084; 

var width = 320,
	height = 240;

// Websocket Server
//var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});

var express = require('express.io'), 
	http = require('http'),
	path = require('path') ;
  
var app = express();

// Server settings
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port',WEBSOCKET_PORT);
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.http().io() ;

app.on('connection', function(socket) {

	//socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

// Serve the video
app.get('/vmo.webm',function(req,res){
   
   console.log( 'Incoming /vmo.webm' ) ;
   // Write header
   //res.writeHead(200, {
   //   'Content-Type': 'video/webm'
   //});
   //res.end() ;
   
   //req.io.route('stream');
});

app.io.route('stream', function(req) {
  
});

app.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		this.clients[i].send(data, opts);
	}
};


// HTTP Server to accept incoming VP8 Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');
	width = (params[1] || 320)|0;
	height = (params[2] || 240)|0;

	console.log(
		'Stream Connected: ' + request.socket.remoteAddress + 
		':' + request.socket.remotePort + ' size: ' + width + 'x' + height
	);
	request.on('data', function(data){
		app.broadcast(data, {binary:true});
	});

}).listen(STREAM_PORT);

console.log('Listening for VP8 Stream on http://127.0.0.1:'+STREAM_PORT+'/<width>/<height>');
console.log('Awaiting WebSocket connections on http://127.0.0.1:'+WEBSOCKET_PORT+'/');
