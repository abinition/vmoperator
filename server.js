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
		 
		 //console.log ( module ) ;
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

  app.use(express.bodyParser());
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

var step = '1' ;
var firstStep = '2' ;
var lastStep = '5' ;
var lotid = 'BALZ99.0' ;
var stage = "Headway" ;
var recipe = "Sputtering" ;

var screen = {
	  "control" : {
		 "firstStep" : firstStep,
		 "lastStep" : lastStep,
		 "step": step
	  },
	  "sequence" : [ 
		 { 
		   "process" : "p1",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p2",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p3",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p4",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p5",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p6",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p7",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p8",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p9",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 },
		 { 
		   "process" : "p10",
		   "periods" : "1",
		   "set" : "2",
		   "description" : ""
		 }
	  ],
	  "wip" : {
		 "lotid": lotid,
		 "stage": stage,
		 "recipe": recipe
	  }
  } ;


child.on('message', function(text) {
  console.log ( "Incoming OCR data" ) ;
  console.log( text ) ;
  // Receive results from child process
  var page = text.split( "\n" );
  var token = [];
  var position = [];
  var sequence = 0; 
  var isPeriods = 1 ;
  var isSet = 0 ;
  var number ;
  var processes = [] ;
  var descriptions = [];
  processes.push ( "Etching" );
  processes.push ( "Sputtering" ) ;
  processes.push ( "No Process" ) ;
  descriptions.push ( "Etch 60 sec" ) ;
  descriptions.push ( "Gap Deposition, Cath 3" ) ;
  descriptions.push ( "400W S/E, 3 min" ) ;
  descriptions.push ( "Sputter etch, 60a nife" ) ;
  descriptions.push ( "<-200A Gap, 1kW, Cath 3" ) ;
  var process = [];
  var description = [];
  for( var i = 0; i < page.length; i++ ) {
	var tokens = page[i].split(" "); 
	if( !tokens ) break ;
	var n=tokens.length;
	for ( var j=0;j<n;j++ )                   
	  if ( tokens[j] != '' ) {
	    token.push( tokens[ j ] );
        position.push ( j ) ;		
      }
  }
  for ( var i=0; i< token.length; i++ ) {
    //console.log( i + ":" + token[i] + "[" + position[i] + "]" ) ;;			
	if ( token[i] == "First" && token[i+1] == "Step" )
	  firstStep = token[i+2] ;
	else if ( token[i] == "Last" && token[i+1] == "Step" )
	  lastStep = token[i+2] ;
	else if ( token[i] == "Step" && token[i+1] == "No" )
	  step = token[i+2] ;  
    else {
	  if (!isNaN(parseInt(token[i]) ) ) {
	    number = parseInt(token[i]) ;
	    if ( position[i] == 0 ) {
          if ( number > 0 && number < 10 ) {
		    sequence = number ;
		    isPeriods = 1 ;
			isSet = 0 ;
		    screen.sequence[sequence-1].process = "" ; 
		    screen.sequence[sequence-1].description = "" ; 
		  }
		}
	    else if ( sequence > 0 && sequence < 10 ) {
	      if  ( isPeriods ) {
		    isPeriods = 0 ;
			isSet = 1 ;
		    screen.sequence[sequence-1].periods = number ; 
		  }
		  else if ( isSet ) {
		    screen.sequence[sequence-1].set = number ;
            isSet = 0 ;			
		  } 
		  else {
		    screen.sequence[sequence-1].description  += token[i] + " " ; 	  
		  }
	    }
	  }
	  else {
	    if ( sequence > 0 && sequence < 10 ) {
  	      if ( isPeriods ) {
		    screen.sequence[sequence-1].process += token[i] + " " ; 	
	  	  }
		  else {
		    screen.sequence[sequence-1].description  += token[i] + " "  ; 
          }
		}
	  }
    }	
  }
  //console.log(description.length);
  /*
  for ( var i=0; i< 10; i++ ) {
    for ( var k=0; k<descriptions.length; k++ ) {
	  if ( description[i] == descriptions[k] ) {
	    screen.sequence[sequence-1].description = description[i] ;
		break ;
	  }
	}
    for ( var k=0; k<processes.length; k++ ) {
	  if ( process[i] == processes[k] ) {
	    screen.sequence[sequence-1].process = process[i] ;
		break ;
	  }
	}
  }
  */
   
  screen.control.firstStep = firstStep ;
  screen.control.lastStep = lastStep ;
  screen.control.step = step ;
  screen.wip.lotid = lotid ;
  screen.wip.stage = stage ;
  screen.wip.recipe = recipe ;
  

  io.sockets.emit('message', screen );
});

child.send("Start OCR worker process...");
console.log("...done");

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.post('/api/step', api.step);
app.get('/api/gem', api.gem);
app.get('/api/kvminit', api.kvminit);
app.get('/api/kvm', api.kvm);
app.get('*', routes.index);



server.broadcast = function(data, opts) {
  //console.log("Broadcasting");
  //for( var i in this.clients ) {
  //  console.log ( this.clients[i] ) ;
  //	this.clients[i].emit(data, opts);
  //}
};

io.sockets.on('connection', function (socket) {
  console.log("Connection established");
  
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