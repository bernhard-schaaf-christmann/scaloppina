// based on https://gist.github.com/ryanflorence/701407
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	Random = require("random-js"),
	port = process.argv[2] || 8888;

const SERVE_DIR = "app_files/";
const NUM_PLAYERS = 1;
const SPECIAL_FILE = "/final.js";
const TANH_SCALE = 2;

/// generator function for the used locations
var get_locations = function() {
	return {"riddle":{}, "wandern":{}};
}

var Transcoder = require("./engine_node.js");
var final_riddle_data = require("./final_riddle.js");

var logn = {
	info : function() {
		console.log.apply(this, arguments);
	},
	debug : function() {
//		console.log.apply(this, arguments);
	}
}

var transcoder = new Transcoder();

var global_submitted_solutions = {};
var location_cardinality = 0;
var results = {};

var final_display_data = {
	"text" : final_riddle_data.alt_.slice(),
	"statistics" : "Server: Es wurden noch keine Lösungen eingereicht."
}

// my polyfill for Array.prototype.includes
if (!Array.prototype.includes) {
	Array.prototype.includes = function(arg) {
		return -1 != Array.prototype.indexOf.call(this, arg);
	}
}

var merge_solution = function(body) {
	var solution = JSON.parse(body);
	var username = solution.username;
	var location_result = solution.location.match('\/([^\.]*)');
	var location = location_result[1];
//	logn.info("location",location);
	if (!location) { return; }
	if (!global_submitted_solutions[location]) { global_submitted_solutions[location] = {}; }
	global_submitted_solutions[location][username] = solution;
	var global_submitted_solutions_str = JSON.stringify(global_submitted_solutions)
	logn.info("User", username, "just submitted solutions for", location+".");
	logn.debug(global_submitted_solutions_str);
	fs.writeFile("submitted_solutions.json", global_submitted_solutions_str);
}

var evaluate_solutions = function() {
	location_cardinality = Object.keys(global_submitted_solutions).length;
	var local_submitted_solutions = JSON.parse(JSON.stringify(global_submitted_solutions)); // kind of deep copy
	var join_callbacks = {
		results : get_locations(),
		submitted_solutions : local_submitted_solutions,
		trigger :location_cardinality,
		callback : when_all_locations_evaluated
	};
	for (var locus in local_submitted_solutions) {
//		logn.info(locus);
		(function(location) {
			var filename = SERVE_DIR+location+"_data.js";
			var local_callback = function(err, file) {
				if(err) {
					return;
				}
				logn.debug("sourcing:", filename);
				var file_source = file.toString("utf8");
				eval(file_source);
				quiz_data_call(location, quiz_data, join_callbacks);  // TODO wieder einsammeln der Ergebnisse der loci
			};
			fs.readFile(filename, local_callback);
		})(locus);
	}
}

var quiz_data_call = function(location, quiz_data, join_callbacks) {
	var cardinality = Object.keys(quiz_data).length-1;
	var sum_strength = 0;
	logn.debug(location, "=", quiz_data, "cardinality", cardinality);
	for (var username in join_callbacks.submitted_solutions[location]) {
		var user_points = 0;
		for (var stage in join_callbacks.submitted_solutions[location][username].solutions) {
			var submitted_password = join_callbacks.submitted_solutions[location][username].solutions[stage];
			var submitted_password_hash = transcoder.encode(submitted_password);
			var needed_password_hash = quiz_data[stage].password_hash;
			logn.debug("checking answer: <"+submitted_password+"> hash <"+submitted_password_hash+"> needed <"+needed_password_hash+">");
			if (submitted_password_hash == needed_password_hash) {
				user_points += 1;
			}
		}
		var percentage = 100*user_points/cardinality;
		logn.info("In \""+location+"\" the user "+username+" has "+user_points+"/"+cardinality+" or "+percentage+"%.");
		if (!results[location]) { results[location] = {}; };
		if (!results[location].statistics) { results[location].statistics = {}; };
		if (!results[location].users) { results[location].users = {}; };
		if (!results[location].users[username]) { results[location].users[username] = {}; };
		results[location].users[username].percentage = percentage;
		sum_strength += percentage;
		results[location].statistics.sum_strength = sum_strength;
	}

	var accumulated_success = sum_strength/NUM_PLAYERS/100;
	results[location].statistics.accumulated_success = accumulated_success;
//	logn.info("Results for "+location+": "+JSON.stringify(results[location]));
	logn.info("Results for "+location+":",results[location]);
	logn.info("Accumulated success for <"+location+"> = "+accumulated_success);
	logn.info("Saturated accumulated success for <"+location+"> = "+Math.tanh(TANH_SCALE*accumulated_success));
	join_callbacks.results[location] = results[location];
	join_callbacks.trigger -= 1;
	if (0 == join_callbacks.trigger) {
		join_callbacks.callback();
	}
};

var when_all_locations_evaluated = function() {
	logn.info("all_locations_evaluated");
	logn.info(this.submitted_solutions);
	logn.info("following results");
	logn.info(this.results);
	var all_accumulated_success = 0;
	for (var locus in this.results) {
		if (this.results[locus].statistics) {
			all_accumulated_success += this.results[locus].statistics.accumulated_success;
		}
	}
	var locations = get_locations();
	var num_locations = Object.keys(locations).length;
	var all_saturated_accumulated_success = Math.tanh(TANH_SCALE*all_accumulated_success/num_locations);
	var final_riddle_length = final_riddle_data.text.length;
	var total_score = Math.round(final_riddle_length*all_saturated_accumulated_success);
	var total_score_possible = final_riddle_length;
	var result_text = "Alle Spieler haben eine Gesamtpunktzahl "+total_score+" von "+total_score_possible+" möglichen Punkten erspielt."

	var alt__text = final_riddle_data.alt_.slice();
	var true_text = final_riddle_data.text.slice();
	var riddle_text = "";


	var mt = Random.engines.mt19937()
	mt.seed(0xACE1);
	var permutation = [];
	var random_next = function(maxn) {
		if (maxn <= permutation.length) {
			return; // Logic Error; we have all combinations
		}
		do {
			var n = (mt()&0x7FFFFFFF)%maxn;
		} while (permutation.includes(n));
		permutation.push(n);
		return n;
	}
//	total_score = 560;
	var i = 0;
	while ((total_score > i) && (total_score_possible > i)) {
		var n = random_next(total_score_possible);
		console.log("DEBUG");
		riddle_text[i] = "."; // exchanging characters by permutation
//		riddle_text[n] = true_text[n]; // exchanging characters by permutation
		i++;
	}

	for (var i = 0; i < true_text.length; i++) {
		if (permutation.includes(i)) {
			riddle_text = riddle_text+true_text[i];
		} else {
			riddle_text = riddle_text+alt__text[i];
		}
	}

	final_display_data.text = riddle_text;
	final_display_data.statistics = result_text;

	logn.info("Accumulated success for ALL = "+all_accumulated_success);
	logn.info("Saturated accumulated success for ALL = "+all_saturated_accumulated_success);

	logn.info("all_following results");

	logn.info(riddle_text);
	logn.info(result_text);
	logn.info(final_display_data);
}

var generate_special_file = function() {
	return "var final_display_data = "+JSON.stringify(final_display_data);
}

http.createServer(function(request, response) {

	var method = request.method;
//	logn.info(method);

	if ("POST" == method) {
//		logn.info("They request to POST this: ", request);
		var body = '';
		request.on('data', function (data) { body += data; });
        request.on('end', function () {
//            console.log("POSTed: " + body.length);
			merge_solution(body); // is synchronous
			evaluate_solutions(); // is asynchronous
        });
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('post received');
		return;
	}

	var user_agent = request.headers["user-agent"];

	var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), SERVE_DIR, uri);

	if (SPECIAL_FILE == uri) {
		special_file = generate_special_file()
		logn.debug(special_file);
		response.writeHead(200);
		response.write(special_file);
		response.end();
		logn.info('generated: "'+filename+'" for "'+user_agent+'"');
		return;
	}

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
			logn.info('delivered: "'+filename+'" to "'+user_agent+'"');
		});
	});
}).listen(parseInt(port, 10));

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");


