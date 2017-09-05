// based on https://gist.github.com/ryanflorence/701407
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	port = process.argv[2] || 8888;

var logn = {
	info : function() {
		console.log.apply(this, arguments); // varargs
	}
}

http.createServer(function(request, response) {

	var method = request.method;
//	logn.info(method);

	if ("POST" == method) {
		logn.info("They request to POST this: ", request);
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.write("Not implemented yet\n");
		response.end();
		return;
	}

	var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

	fs.exists(filename, function(exists) {
		if(!exists) {
		  response.writeHead(404, {"Content-Type": "text/plain"});
		  response.write("404 Not Found\n");
		  response.end();
		  return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			response.writeHead(200);
			response.write(file, "binary");
			response.end();
			logn.info("delivered: ", filename);
		});
	});
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

