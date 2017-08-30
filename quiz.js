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
	var text_block = document.querySelector('#text-block');
	console.log(text_block);

	var show = function(message) {
		if (text_block) {
			text_block.innerHTML = message;
		}
	}
	var show_and_log = function(msg) {show(msg); console.log(msg)};
	if (!tests_ok(show_and_log)) {
		show("Some Tests failed. Stopping. We think this platform is not appropriate to run this. Sorry.");
		return;
	}
	show("Starte Berechnung…");

	// username needed for indexing the final result
	var local_data = {
		"username" : "brs",
		"stage" : "start"
	}
	show_and_log(local_data);
	// TODO get some input from the user for the username
	var put_local_data = function(data) { localStorage.setItem("local_data", JSON.stringify(local_data)); };
	var get_local_data = function() { return JSON.parse(localStorage.getItem("local_data")) };
	put_local_data(local_data);
	
	var tick = function() {
//		show("Fertig!");
		var result = get_local_data(); // TODO just testing
		show("username: " + result.username + "<br>stage: " + result.stage); // TODO just testing
		setTimeout(tick, 1);
	}

	tick();
	var stage = local_data.stage;
	var next = quiz_data[stage].next;
	show_and_log(JSON.stringify(quiz_data[stage]) + " " + next); // TODO just testing
}

window.onload = main;
