
if( process.argv.length < 3 ) {
	console.log(
		'Usage: \n' +
		'node mpeg_server.js <secret>'
	);
	process.exit();
}

var doMobile = 1 ;
var STREAM_SECRET = process.argv[2] ;
var STREAM_PORT1 = 8081,
	STREAM_PORT2 = 8082,
	WEBSOCKET_PORT1 = 8083,
	WEBSOCKET_PORT2 = 8084,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width1 = 640,
	height1 = 480,
	width2 = 320,
	height2 = 240 ;

// Websocket Servers
var socketServer1 = new (require('ws').Server)({port: WEBSOCKET_PORT1,host:'192.168.11.103'});
var socketServer2 = new (require('ws').Server)({port: WEBSOCKET_PORT2,host:'192.168.11.103'});
socketServer1.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width1, 4);
	streamHeader.writeUInt16BE(height1, 6);
	socket.send(streamHeader, {binary:true});
	console.log( 'New WebSocket 640x480 Connection ('+socketServer1.clients.length+' total)' );
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer1.clients.length+' total)' );
	});
});
socketServer2.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width2, 4);
	streamHeader.writeUInt16BE(height2, 6);
	socket.send(streamHeader, {binary:true});
	console.log( 'New WebSocket 320x240 Connection ('+socketServer2.clients.length+' total)' );
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer2.clients.length+' total)' );
	});
});
socketServer1.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		try {
		  this.clients[i].send(data, opts);
		}
		catch ( e ) {
			console.log(e);
		}
	}
};
socketServer2.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		try {
			this.clients[i].send(data, opts);
		}
		catch ( e ) {
			console.log(e);
		}
	}
};

// HTTP Server to accept (a single) incoming MPEG Stream
var streamServer1 = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');
	width = (params[1] || 640)|0;
	height = (params[2] || 480)|0;
	if( params[0] == STREAM_SECRET ) {
		console.log(
			'Stream Connected: ' + request.socket.remoteAddress + 
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer1.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + 
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}).listen(STREAM_PORT1);
console.log('Listening for MPEG Stream on '+STREAM_PORT1+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on '+WEBSOCKET_PORT1+'/');

var streamServer2 = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');
	width = (params[1] || 320)|0;
	height = (params[2] || 240)|0;
	if( params[0] == STREAM_SECRET ) {
		console.log(
			'Stream Connected: ' + request.socket.remoteAddress + 
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer2.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + 
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}) ;
if ( doMobile ) {
  streamServer2.listen(STREAM_PORT2);
  console.log('Listening for MPEG Stream on '+STREAM_PORT2+'/<secret>/<width>/<height>');
  console.log('Awaiting WebSocket connections on '+WEBSOCKET_PORT2+'/');
}