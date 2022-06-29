var http = require('http');
var url = require('url');

// create a server object:
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); // send response header
    res.write(req.url); // write a response to the client
    res.end(); // end the response
}).listen(8088); // the server object listens on port 8088

