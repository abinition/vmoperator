/* VMOperator NodeJS server */

/* Environment */
process.env.NODE_ENV = process.env.NODE_ENV || "development";

var config = require('./config/'+process.env.NODE_ENV+'.json') ;
config.port      = process.env.NODE_PORT || 8001;
config.node      = process.env.NODE_NODE || "0.0.0.0"
config.protocol  = process.env.NODE_PROT || "http" ;
console.log ( config ) ;

/* Bootstrap */
var express   = require("express");
var fs = require ( "fs" ) ;


var app = module.exports = express();
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

console.log("on message");
child.on('message', function(m) {
  // Receive results from child process
  console.log(m);
});
child.send("Start");
console.log("...done");

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get("/jsmpeg", function (req, rsp) {

    rsp.render("jsmpeg", {
      layout: "layout"
    });
});

// JSON API

app.get('/api/gem', api.gem);
app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


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

app.listen(config.port,'192.168.11.103', function(){
  console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
});