/* VMOperator NodeJS server */

/* Environment */
process.env.NODE_ENV = process.env.NODE_ENV || "development";

var config = require('./config/'+process.env.NODE_ENV+'.json') ;
config.port      = process.env.NODE_PORT || 8080;
config.host      = process.env.NODE_HOST || "192.168.11.103"
config.protocol  = process.env.NODE_PROT || "http" ;
console.log ( config ) ;

/* Bootstrap */
var express   = require("express");
var app = module.exports = express();
var options = {} ;

/* Put all our handlers in an easy to access repository */
var handlers = {
        "express"               : express, // Homogenize
        "http"                  : require('http'),
        "path"                  : require('path'),
        "jade"                  : require("jade"),
		"less"					: require('less-middleware')
 };

/* Routes and API */
var 	 routes = require('./routes'),
		 api = require('./routes/api');

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

  app.set("title", "vmotool");  
  app.use(express.logger('dev'));
  app.set("view engine", "jade");
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false, pretty: true} );
  app.use(express.static(__dirname + "/public"));
  app.use( handlers.less({src: __dirname + "/public"}));
  app.use(express.bodyParser());
  app.use(express.urlencoded());
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
			
// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/gem', api.gem);
app.get('*', routes.index);

// --------------------
// listen
// --------------------

app.listen(config.port,config.host, function(){
  console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
});