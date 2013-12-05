<!DOCTYPE html>
<html>
  <head>
    <title>Screencast test</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>Screencast test</h1>
    <video controls preload="none" autoplay="autoplay" autobuffer id="video">
        <source src="video.webm" type="video/webm">
        <p>Your browser does not support WebM video.</p>
    </video>
  </body>
</html>

var express = require('express')
  , http = require('http')
  , path = require('path')
  , child_process = require("child_process")
var app = express();
// Server settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());
// View start page
app.get('/',function(req,res){
    res.render("video"); // Render basic HTML5 video player for /video.webm
});
// Serve the video
app.get('/video.webm',function(req,res){
    // Start demo "simulation"
    var glxgears = child_process.spawn("glxgears",[]);
    // Wait for glxgears to start properly
    setTimeout(function(){
        // Use xwininfo to get the glxgears window position
        var cmd = "xwininfo -root -tree";
        child_process.exec(cmd,function(err,stdout,stderr){
            if(err) return next(err);
            // Get the X11 window size and position
            var lines = stdout.toString().split("\n");
            var width = 300;
            var height = 300;
            var top = 55;
            var left = 52;
            for(var i=0; i<lines.length; i++){
                if(lines[i].match(/gears/)){
                    // Got something like:
                    // 0x5000002 "glxgears": ()  300x300+0+0  +328+89
                    var r = /(\d+)x(\d+)\+(\d+)\+(\d+)\s+\+(\d+)\+(\d+)/;
                    var m = lines[i].match(r);
                    width = m[1];
                    height = m[2];
                    top = m[5];
                    left = m[6];
                    break;
                }
            }
            // Write header
            res.writeHead(200, {
              'Content-Type': 'video/webm'
            });
            // Start ffmpeg
            var ffmpeg = child_process.spawn("ffmpeg",[
                "-re",                   // Real time mode
                "-f","x11grab",          // Grab screen
                "-r","100",              // Framerate
                "-s",width+"x"+height,   // Capture size
                "-i",":0+"+top+","+left, // Capture offset
                "-g","0",                // All frames are i-frames
                "-me_method","zero",     // Motion algorithms off
                "-flags2","fast",
                "-vcodec","libvpx",      // vp8 encoding
                "-preset","ultrafast",
                "-tune","zerolatency",
                "-b:v","1M",             // Target bit rate
                "-crf","40",             // Quality
                "-qmin","5",             // Quantization
                "-qmax","5",
                "-f","webm",             // File format
                "-"                      // Output to STDOUT
            ]);
            // Pipe the video output to the client response
            ffmpeg.stdout.pipe(res);
            // Kill the subprocesses when client disconnects
            res.on("close",function(){
                glxgears.kill();
                ffmpeg.kill();
            })
        });
    },500);
});
// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});