var nodecr = require('nodecr') ;
var fs = require('fs') ;
	
process.on('message', function(m) {
  // Do work  (in this case just up-case the string
  console.log(m);
});

var busy = 0 ;
function doOCR() {
  var dt = new Date();
  var min = dt.getMinutes() ;
  if ( min < 10 ) min = "0" + min ;
  var sec = dt.getSeconds() ;
  if ( sec < 10 ) sec = "0" + sec ;
  var fileSpec = __dirname + "/data/console_00" + min + sec +".jpg" ;
  fs.exists ( fileSpec, function () {
    if ( !busy ) {
      busy = 1 ;
      nodecr.process( fileSpec, function(err, text) {
        if (err)
          console.error(err);
	    else
          process.send(text);
		busy = 0 ;
      }) ;
    }
  });
}	
setInterval ( doOCR, 1000 ) ;