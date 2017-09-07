'use strict';
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
	if (!tests_ok(function(msg) {show(msg); console.log(msg)})) {
		show("Some Tests failed. Stopping. We think this platform is not appropriate to run this. Sorry.");
		return;
	}
	show("Starte Berechnung…");

	var transcoder = new Transcoder();
	var tick = function() {
		var boost = 256; // we don't want to show every single step, to slow
		var result = transcoder.step_check_lfsr_period();
		while (boost > 0 && !result.finished) {
			result = transcoder.step_check_lfsr_period();
			--boost;
		}
		if (!result.finished) {
			/// still some string juggling necessary because of inconveniences of underlying transcoder
			show("Berechnung läuft…<br>Linear Feedback Shift Register-Wert = 0x"+("000" + result.lfsr.toString(16)).slice(-4)+"<br>Schritte: "+result.period);
			setTimeout(tick, 1);
		} else {
			show("Fertig!<br>Linear Feedback Shift Register-Wert = 0x"+("000" + result.lfsr.toString(16)).slice(-4)+"<br>Periode: "+result.period);
		}
	}

	var some_string = "🏁 Ä Ö Ü ä ö ü ß € µ – · … Ｈａｌｌｏ Ｌｅｕｔｅ!";
	var vorher = unicodeStringToTypedArray(some_string);
	console.log(some_string);
	console.log(vorher);
	console.log(transcoder.encode_to_array(some_string)); // many special multibyte characters.
	var result = transcoder.encode_to_array(some_string);
	console.log(transcoder.to_base64(result));
	console.log(transcoder.encode("5,3")); // many special multibyte characters.
	tick();
}

window.onload = main;
