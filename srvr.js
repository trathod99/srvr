#!/usr/bin/env node
// get dependencies
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

// alert
console.log("Starting!");

// set up network detail variables
var host = "0.0.0.0";
var args = process.argv;
var port = args[2];
if (port) {
} else {
        var port = 3000;
}

// start server
var server = http.createServer(function(req, res){

        // alert
        console.log("Received request:" + req.url);
        
        // put together full path of requested files + alert it
        var dir = process.cwd();
        var fileRequest = dir + url.parse(req.url).pathname;
        console.log("Filename of request: " + fileRequest);
        
        // read the requested file and determine filetype
        fs.readFile(fileRequest, "utf-8", function(error, data) {
        type = path.extname(fileRequest);
        console.log("Type: " + type);

                // load every part of the request
                if (error) {
                        res.writeHead(404, {"Content-type":"text/plain"});
                        res.end("Error!");
                } else {

                        // assign content-type to header based on detected file type
                        function setContentType(contentType) {
                                res.writeHead(200, {"Content-type":contentType});
                                res.write(data);
                                res.end();
                        };
                        switch (type) {
                                case ".html":
                                        fs.appendFile(fileRequest, '<script src="http://54.149.254.223:' + port + '/livereload.js?snipver=1"></script>', function(err) {
                                                if (err) throw err;
                                                console.log("Appended LiveReload script.");
                                        });
                                        setContentType("text/html");
                                case ".js":
                                        setContentType("text/javascript");
                                case ".css":
                                        setContentType("text/css");
                                case ".jpe":
                                case ".jpg":
                                case ".jpeg":
                                        setContentType("image/jpeg");
                                case ".gif":
                                        setContentType("image/gif");
                                case ".svg":
                                        setContentType("image/svg");
                        }
                }
        });
});

// activate server listening
server.listen(port, host, function(){
        console.log("Listening " + host + ":" + port);
});
