var nodecr = require('nodecr') ;
var fs = require('fs') ;
	
process.on('message', function(m) {
  // Do work 
  console.log(m);
});

var dt;
var min  ;
var sec ;
var busy = 0 ;
var fileSpec ;

function getFileSpec() {
  dt = new Date();
  min = dt.getMinutes() ;
  if ( min < 10 ) min = "0" + min ;
  sec = dt.getSeconds() ;
  if ( sec < 10 ) sec = "0" + sec ;
  return  __dirname + "/data/console_00" + min + sec +".jpg" 
} ;

function doOCR() {

  fs.exists ( fileSpec, function () {
    if ( !busy ) {
      busy = 1 ;
      nodecr.process( fileSpec, function(err, text) {
        if (err)
          console.error(err);
	    else
          process.send(text);
		busy = 0 ;
        fileSpec = getFileSpec() ;
      }, "eng", 6 ) ;
    }
  });
}	
fileSpec = getFileSpec() ;
setInterval ( doOCR, 2000 ) ;