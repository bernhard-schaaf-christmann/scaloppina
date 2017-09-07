'use strict';

function main() {
	console.log("login");

	var local_data = {
		"username" : "",
		"stage" : "start"
	}

	var input_username = document.querySelector('#input-username');
	var button_enter_username = document.querySelector('#button-enter-username');

	var logn = function() { console.log.apply(this, arguments); };
	var put_local_data = function(data) { localStorage.setItem("local_data", JSON.stringify(data)); };


	var on_button_click = function() {
		check_username(true);
	}

	var on_input_change = function() {
		check_username(false);
	}

	var	check_username = function(proceed) {
		var username = input_username.value;
		logn("check_username:", username);
		if (username && username.length > 0) {
			local_data.username = username;
			logn("proceed with new username");
			put_local_data(local_data);
			window.location = "fork.html";
		}
		if (proceed) {
			logn("proceed with exiting username");
			window.location = "fork.html";
		}
	}

	button_enter_username.addEventListener('click', on_button_click);
	input_username.addEventListener('change', on_input_change);

}

window.onload = main;
