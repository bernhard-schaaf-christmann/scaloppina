'use strict';

/******************************************************************************
* Tests
******************************************************************************/
/// entry point for tests
function tests_ok(show) {
	show("Starting internal selftest…");
	return test_dummy(show) && test_local_storage(show); // add further test with logical and for short circuit evaluation
}

/// root of tests
function test_dummy(show) {
	show("Running test_dummy.");
	return true;
}

function test_local_storage(show) {
	// Save data to the current local store
	var reference = "John";
	localStorage.setItem("test_username", reference);

	// Access some stored data
	var result = localStorage.getItem("test_username");
	show( "test_username = " + result);

	if (result.length != reference.length) {
		show("String lengths don't match.");
		return false;
	}
	if (!result.endsWith(reference)) {
		show("String endings don't match.");
		return false;
	}
	return true;
}
/*****************************************************************************/

/// our entry point
function main() {
	console.log("HI and WELCOME");
	// TODO test_ok ausführen und bei Misserfolg dem Nutzer mitteilen
	var transcoder = new Transcoder();
	var text_block = document.querySelector('#text-block');
	var commit_button = document.querySelector('#commit-button');
	var next_button = document.querySelector('#next-button');
	var restart_button = document.querySelector('#restart-button');
	var submit_button = document.querySelector('#submit-button');
	var input_pass = document.querySelector('#input-pass');
	var image_part = document.querySelector('#image-part');
	console.log(text_block);

	var show_string = function(message) {
		if (text_block) {
			text_block.innerHTML = message;
		}
	}
	var show = function() {
		var result = Array.prototype.join.call(arguments);
		show_string(result);
	}
	var logn = function() { console.log.apply(this, arguments); };
	var show_and_log = function(msg) {show.apply(this, arguments); logn.apply(this, arguments); };
	if (!tests_ok(show_and_log)) {
		show("Some Tests failed. Stopping. We think this platform is not appropriate to run this. Sorry.");
		return;
	}
	show("Starte Berechnung…");

	// TODO username needed for indexing the final result
	var local_data = {
		"username" : "brs",
		"stage" : "start"
	}
	show_and_log(local_data);
	// TODO pre check if already local data exists on this browser instance and merge data
	// TODO get some input from the user for the username
	var put_local_data = function(data) { localStorage.setItem("local_data", JSON.stringify(local_data)); };
	var get_local_data = function() { return JSON.parse(localStorage.getItem("local_data")) };
	put_local_data(local_data); // TODO check if we have privious data and ask(?) if we want to keep it

	var on_commit_click = function() {
		logn("commit");
		var image_data_url = "data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGP\
C/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YGARc5KB0XV+IA\
AAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAF1J\
REFUGNO9zL0NglAAxPEfdLTs4BZM4DIO4C7OwQg2JoQ9LE1exdlYvBBeZ7jq\
ch9//q1uH4TLzw4d6+ErXMMcXuHWxId3KOETnnXXV6MJpcq2MLaI97CER3N0\
vr4MkhoXe0rZigAAAABJRU5ErkJggg=="; // from https://de.wikipedia.org/wiki/Data-URL
		show_image(image_data_url, 50, 50, "direkt Bilddaten"); // TODO just testing direkt data drawing
		var pass = input_pass.value;
		check_pass(pass);
	}

	var proceed = function() {
		var stage = local_data.stage;
		var next = quiz_data[stage].next;
		if (0 == next.length) {
			return;
		}
		local_data.stage = next;
		put_local_data(local_data);
		redraw();
	}

	var on_next_click = function() {
		logn("next");
		proceed();
	}

	var on_restart_click = function() {
		logn("restart");
		local_data.stage = "start";
		put_local_data(local_data);
		redraw();
	}

	var on_submit_click = function() {
		logn("submit");
		var http = new XMLHttpRequest();
		var url = "put_passwords.js";
		var params = "lorem=ipsum&name=brs";
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() { //Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				logn("HTTP response of submit: ", http.responseText);
			}
		}
		http.send(params);
	}

	var check_pass = function(pass) {  // TODO vermutlich wird dieses Event beim Bild wechsel einmal zu oft ausgeführt, was man nur merkt, wenn zwei hintereinanderfolgende Rätsel die selbe Lösung haben.
		var stage = local_data.stage;
		var hash = transcoder.encode(pass);
		logn("checking answer: ", pass, " hash ", hash);
		var needed_hash = quiz_data[stage].password_hash;
		logn("needed: ", needed_hash);
		if (hash == needed_hash) {
			logn("correct!");
			proceed();
		}
		logn("Sorry, wrong!");
	}

	var on_pass_input = function() {
		var pass = this.value;
		check_pass(pass);
	}

	commit_button.addEventListener('click', on_commit_click);
	next_button.addEventListener('click', on_next_click);
	restart_button.addEventListener('click', on_restart_click);
	submit_button.addEventListener('click', on_submit_click);
	input_pass.addEventListener('change', on_pass_input);

	var redraw = function() {
		var stage = local_data.stage;
		var next = quiz_data[stage].next;
		var image_file_name = quiz_data[stage].image;
		show_and_log(quiz_data[stage].text);
		image_part.src = image_file_name;
		logn(next);
	}
	redraw()
}

// fom https://stackoverflow.com/q/37952083
function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;

  // This next line will just add it to the <body> tag
  document.body.appendChild(img);
}

window.onload = main;
