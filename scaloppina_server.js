// based on https://gist.github.com/ryanflorence/701407
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	port = process.argv[2] || 8888;

const SERVE_DIR = "app_files/"

var logn = {
	info : function() {
		console.log.apply(this, arguments); // varargs
	}
}

var submitted_solutions = {};

var merge_solution = function(body) {
	var solution = JSON.parse(body);
	var username = solution.username;
	var location_result = solution.location.match('\/([^\.]*)');
	var location = location_result[1];
//	logn.info("location",location);
	if (!location) { return; }
	if (!submitted_solutions[location]) { submitted_solutions[location] = {}; }
	submitted_solutions[location][username] = solution;
	var submitted_solutions_str = JSON.stringify(submitted_solutions)
	logn.info("User", username, "just submitted solutions for", location+".");
//	logn.info(submitted_solutions_str);
	fs.writeFile("submitted_solutions.json", submitted_solutions_str);
}

var evaluate_solutions = function() {
	for (var locus in submitted_solutions) {
//		logn.info(locus);
		(function(location) {
			var filename = SERVE_DIR+location+"_data.js";
			var local_callback = function(err, file) {
				if(err) {
					return;
				}
				logn.info("sourcing:", filename);
				var file_source = file.toString("utf8");
				eval(file_source);
				quiz_data_call(location, quiz_data);
			};
			fs.readFile(filename, local_callback);
		})(locus);
	}
}

var quiz_data_call = function(location, quiz_data) {
	var cardinality = Object.keys(quiz_data).length-1;
	console.log(location, "=", quiz_data, "cardinality", cardinality);
	for (var username in submitted_solutions[location]) {
		for (var stage in submitted_solutions[location][username].solutions) {
			var submitted_password = submitted_solutions[location][username].solutions[stage];
			var needed_password_hash = quiz_data[stage].password_hash;
			logn.info("pass:", submitted_password, "needed", needed_password_hash);
		}
	}
};

http.createServer(function(request, response) {

	var method = request.method;
//	logn.info(method);

	if ("POST" == method) {
//		logn.info("They request to POST this: ", request);
		var body = '';
		request.on('data', function (data) { body += data; });
        request.on('end', function () {
//            console.log("POSTed: " + body.length);
			merge_solution(body);
			evaluate_solutions();
        });
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('post received');
		return;
	}

	var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), SERVE_DIR, uri);

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


