/* VMOperator NodeJS server */

/* Environment */
process.env.NODE_ENV = process.env.NODE_ENV || "development";

var config = require('./config/'+process.env.NODE_ENV+'.json') ;
config.port      = process.env.NODE_PORT || 8001;
config.host      = process.env.NODE_HOST || "192.168.11.103";
config.protocol  = process.env.NODE_PROT || "http" ;
console.log ( config ) ;

/* Bootstrap */
var express   = require("express");
var fs = require ( "fs" ) ;

var app = module.exports = express();
var server = require ( "http" ).createServer(app) ;
var io = require ( "socket.io" ).listen(server);
io.set('log level', 1);
/*
      'disconnect': 0
    , 'connect': 1
    , 'heartbeat': 2
    , 'message': 3
    , 'json': 4
    , 'event': 5
    , 'ack': 6
    , 'error': 7
    , 'noop': 8
 */
 
var options = {} ;
/*
if ( config.protocol == "https" ) {
  options.key  = fs.readFileSync('./certs/privkey.pem'),
  options.cert = fs.readFileSync('./certs/cacert.pem')
  app   = express.createServer(options);
}
else
  app   = express.createServer();
*/

/* Put all our handlers in an easy to access repository */
var handlers = {
        "express"               : express, // Homogenize
        "http"                  : require('http'),
        "path"                  : require('path'),
        "jade"                  : require("jade"),
		"less"					: require('less-middleware'),
		"cp"         			: require('child_process')
        //"jquery"                : require('jquery'),
        //"store"                 : require('connect-redis')(express),
        //"crypto"                : require('crypto'),
        //"harp"                  : require('harp'),
        //"templatizer"           : require('templatizer')
 };

/* Routes and API */
var 	 routes = require('./routes'),
		 api = require('./routes/api');
		 
//routes.marketing	= require('./routes/marketing');
//routes.api		= require('./routes/api').api;

/* Middleware *
var m  = require('./lib/middleware') ;
var protect     = [m.authenticate, m.profile, m.networks, m.action];
var sessionData = [m.profile, m.networks, m.action];
var apiProtect  = [m.apiAuthenticate, m.profile];
var apiSession  = [m.profile];
*/

 /******************************
  * Handlers (global)
  *******************************/
// First pass
function logErrors(err, req, res, next)
{
  console.log("Error pass 1");
  console.error(err.stack);
  // Onto second pass
  next(err);
}

// Second pass
function clientErrorHandler(err, req, res, next)
{
  console.log("Error pass 2");
  if (req.xhr) {
        // AJAX request went awry
        res.send(500, { error: 'Something blew up!' });
  }
  else {
        // Onto third pass
    next(err);
  }
}

/* Third pass catch-all
function errorHandler(err, req, res, next)
{
  res.status(500);
  res.render('error', { error: err });
}
*/

/* Configuration */
app.configure( function () {

  app.set("title", "vmoperator");  
  
  app.use(express.logger('dev'));

  app.set("view engine", "jade");
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false, pretty: true} );
  
  app.use(express.static(__dirname + "/public"));
  app.use( handlers.less({src: __dirname + "/public"}));
  //app.use(harp.pipeline(__dirname + "/public"));

  app.use(express.urlencoded());

  //app.use(express.bodyParser());
  //express.bodyParser.parse['multipart/form-data'] = m.multipart;  app.use(express.json());

  app.use(express.cookieParser());

  //app.use(express.session({ secret: "abinition ftw", store: new store }));
  app.use(express.methodOverride());

  app.use(app.router);
	
   // Three tier error handling
  app.use(logErrors);
  app.use(clientErrorHandler);
  //app.use(errorHandler);
});

// For development only
app.configure('development', function(){
    app.locals.pretty = true;
	app.set('db uri', 'localhost/dev');
	app.use(express.errorHandler( {dumpExceptions: true, showStack: true } ));
});

// For production only
app.configure('production', function(){
	app.set('db uri', 'n.n.n.n/prod');
	app.use(express.errorHandler());
});
			
/*
templatizer( __dirname + '/views/templates',
             __dirname + '/public/js/app/templates.js');
*/

// Recognise text of any language in any format
console.log("forking");

var child = handlers.cp.fork('./ocr_worker');
var screen ;

var name = '' ;
var loadlock = '' ;
var id = '' ;
var helium = '' ;
var voltage = '' ;
var temp = '' ;
var lotid = '' ;
var stage = '' ;
var recipe = '' ;
var step = '' ;
var time = '' ;
var chamber = '' ;
var rf = '' ;

child.on('message', function(text) {
  console.log ( text ) ;
  // Receive results from child process
  var page = text.split( "\n" );
  var token = [];
  var sensorOffset = 0 ;
  var recipeOffset = 0 ;
  var sequenceOffset = 0 ;
  var wipOffset = 0 ;
  for( var i = 0; i < page.length; i++ ) {
	var tokens = page[i].split(" "); 
	if( !tokens ) break ;
	var n=tokens.length;
	for ( var j=0;j<n;j++ )                   
	  if ( tokens[j] != '' ) {
	    token.push( tokens[ j ] ); 
      }
  }
  for ( var i=0; i< token.length; i++ )
	if ( token[i] == "Sensors" )
	  sensorOffset = i ;
	else if ( token[i] == "Sequence" )
	  sequenceOffset = i ;		
	else if ( token[i] == "Recipe" )
	  recipeOffset = i ;	
	else if ( token[i] == "WIP" )
     wipOffset = i ;
	 
  if ( recipeOffset > 0 ) {
    name =  token[recipeOffset+1] ;
    loadlock = token[recipeOffset+2] == "LLA" ? "A" : "B" ;
  }

  if ( sequenceOffset > 0 ) {
    id =  token[sequenceOffset+2] ;
    helium =  token[sequenceOffset+5] + ' ' + token[sequenceOffset+6] ;
    voltage = token[sequenceOffset+10] + ' ' + token[sequenceOffset+11] ;
    temp =  token[sequenceOffset+15] + ' ' + token[sequenceOffset+16] ;
  }
  
  if ( wipOffset > 0 ) {
    lotid =token[wipOffset+2] ;
    stage = token[wipOffset+4] ;
    recipe = token[wipOffset+6] ;
  }

  if ( sensorOffset > 0 ) {
	step =  token[sensorOffset+4] ;
    time = token[sensorOffset+8] + ' ' + token[sensorOffset+9] ;
    chamber =  token[sensorOffset+12] + ' ' + token[sensorOffset+13] ;
    rf =  token[sensorOffset+15] + ' ' + token[sensorOffset+16] ;
  }

  screen = {
	  "recipe" : {
		 "name" : name,
		 "loadlock" : loadlock
	  },
	  "sequence" : {
		 "id" : id,
		 "helium" : helium,
		 "voltage" : voltage,
		 "temp" : temp
	  },
	  "wip" : {
		 "lotid": lotid,
		 "stage": stage,
		 "recipe": recipe
	  },
	  "sensors" : {
		 "step" : step,
		 "time": time,
		 "chamber" : chamber,
		 "rf" : rf
	  }
  } ;
  io.sockets.emit('message', screen );
});

child.send("Start OCR worker process...");
console.log("...done");

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/gem', api.gem);
app.get('*', routes.index);

server.broadcast = function(data, opts) {
  //console.log("Broadcasting");
  //for( var i in this.clients ) {
  //  console.log ( this.clients[i] ) ;
  //	this.clients[i].emit(data, opts);
  //}
};

io.sockets.on('connection', function (socket) {
  socket.emit('message', screen );
  //socket.on('message', function (data) {
  //  console.log('received message');
  //  console.log(data);
  //});
  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});


/**
 * Authentication Endpoints
 *
app.get("/login", function (req, rsp) {
  rsp.render("empty", {
    layout: "layouts/vmoperator"
  })
});
app.get("/signup", function (req, rsp) {
  rsp.render("empty", {
    layout: "layouts/vmoperator"
  })
});

* Marketing routes

app.get("/about", routes.marketing.about);

/**
 * Open Endpoints
 *
app.get("/api/posts/:post_id",                routes.api.posts.show);
app.post("/api/auth/login",                   routes.api.auth.login);

**
 * Protected Endpoints
 *
app.put("/api/profile/:username",             m.auth, routes.api.profile.update);
app.post("/api/profile/:account_id/follow",   m.auth, routes.api.profile.follow);
app.delete("/api/profile/:account_id/follow", m.auth, routes.api.profile.unfollow);
app.get("/api/profile/:account_id/topics",    m.auth, routes.api.profile.topics);
*/

// --------------------
// listen
// --------------------

server.listen(config.port, config.host, function(){
  console.log("Express server listening on %s:%d in %s mode", config.host, config.port, app.settings.env);
});