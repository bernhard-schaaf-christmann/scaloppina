'use strict';

/******************************************************************************
* Tests
******************************************************************************/
/// entry point for tests
function tests_ok(show) {
	show("Starting internal selftest…");
	return test_dummy(show) && test_local_storage(show) && test_utf8_string_transcoder(show); // add further test with logical and for short circuit evaluation
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

	var transcoder = new Transcoder();
	var quiz_title = document.querySelector('#quiz-title');
	var intro_block = document.querySelector('#intro-block');
	var text_block = document.querySelector('#text-block');
	var commit_button = document.querySelector('#commit-button');
	var next_button = document.querySelector('#next-button');
	var restart_button = document.querySelector('#restart-button');
	var submit_button = document.querySelector('#submit-button');
	var input_pass = document.querySelector('#input-pass');
	var image_part = document.querySelector('#image-part');
	var info_box = document.querySelector('#info-box');

	var show_on_target = function() {
		var result = Array.prototype.join.call(arguments);
		if (this) {
			this.innerHTML = result;
		}
	}

	var show_title = function() { show_on_target.apply(quiz_title, arguments); };
	var show_intro = function() { show_on_target.apply(intro_block, arguments); };
	var show       = function() { show_on_target.apply(text_block, arguments); };
	var show_info  = function() { var result = Array.prototype.join.call(arguments); info_box.value = result; };

	var logn = function() { console.log.apply(this, arguments); };
	var show_and_log = function(msg) { show.apply(this, arguments); logn.apply(this, arguments); };

	if (!tests_ok(show_and_log)) {
		var msg = "Some Tests failed. Stopping. We think this will not run properly on your platform. Sorry.";
		show_and_log(msg);
		show_info(msg);
		return;
	}
	show("Starte Berechnung…");

	var local_data = {
		"username" : "brs",
		"stage" : "start"
	}
	var put_local_data = function(data) { localStorage.setItem("local_data", JSON.stringify(data)); };
	var get_local_data = function() { return JSON.parse(localStorage.getItem("local_data")) };
	var intermediate_data = get_local_data();
	if (!intermediate_data) {
		put_local_data(local_data);
		logn("no local data found. initializing it.");
	} else {
		local_data = intermediate_data;
		logn("local data found. using it.");
	}

	local_data.stage = "start";
	put_local_data(local_data);

	var solutions = {};

	// initializing finished

	var on_commit_click = function() {
		logn("commit");
		check_pass(input_pass.value);
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
		var exam = JSON.parse(JSON.stringify(local_data));
		exam.solutions = solutions;
		exam.location = window.location.pathname;
		var params = JSON.stringify(exam);
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() { //Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				logn("HTTP response of submit: ", http.responseText);
				show_info("Server hat empfangen.");
			} else {
				show_info("FEHLER beim senden zum Server. Prüfe deine WLAN Verbindung.");
			}
		}
		http.send(params);
	}

	var toggle = 0;
	var toggle_strings = ["leider falsch", "nicht korrekt", "deine lösung passt nicht"];

	var check_pass = function(pass) {  // TODO vermutlich wird dieses Event beim Bild wechsel einmal zu oft ausgeführt, was man nur merkt, wenn zwei hintereinanderfolgende Rätsel die selbe Lösung haben.
		var stage = local_data.stage;
		var hash = transcoder.encode(pass);
		var needed_hash = quiz_data[stage].password_hash;
		logn("checking answer: <"+pass+"> hash <"+hash+"> needed <"+needed_hash+">");
		if (hash == needed_hash) {
			logn("correct!");
			show_info("korrekt");
			solutions[stage] = pass;
			proceed();
			return;
		}
		logn("Sorry, wrong!");
		show_info(toggle_strings[toggle]);
		toggle = toggle+1;
		if (toggle_strings.length <= toggle) {
			toggle = 0;
		}
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

	var clear_input_pass = function() {
		input_pass.value = "";
	}

	var redraw = function() {
		clear_input_pass();
		var stage = local_data.stage;
		var next = quiz_data[stage].next;
		var image_file_name = quiz_data[stage].image;
		var quiz_title = quiz_data[stage].quiz_title;
		var intro = quiz_data[stage].intro;
		var text = quiz_data[stage].text;
		logn("stage:", stage);
		if (quiz_title) { logn(quiz_title); show_title(quiz_title); } else { show_title("Ｓｃｈｎｉｔｚｅｌｊａｇｄ"); }
		if (intro) { logn(intro); show_intro(intro); } else { show_intro(""); }
		if (text) { logn(text); show(text); } else { show(""); }
		if (image_file_name) { image_part.src = image_file_name; } else { image_part.src = ""; }
		logn("next:", next);
	}
	redraw()
}

window.onload = main;