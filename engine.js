'use strict';

/******************************************************************************
* Helper functions
******************************************************************************/

/* code adapted from
* https://coolaj86.com/articles/unicode-string-to-a-utf-8-typed-array-buffer-in-javascript/
*/
/// string to uint array
function unicodeStringToTypedArray(s) {
    var escstr = encodeURIComponent(s);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCodePoint('0x' + p1);
    });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.codePointAt(0);
    });
    return ua;
}

/// uint array to string
function typedArrayToUnicodeString(ua) {
    var binstr = Array.prototype.map.call(ua, function (ch) {
        return String.fromCodePoint(ch);
    }).join('');
    var escstr = binstr.replace(/(.)/g, function (m, p) {
        var code = p.codePointAt(p).toString(16).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    });
    return decodeURIComponent(escstr);
}

/******************************************************************************
* Class encapsulating a LFSR in Fibonacci form
******************************************************************************/

/// Constructor: seed is starting value
var Linear_Feedback_Shift_Register = function(seed) {
	if (!seed) {
		seed = 1;
	}
	this.lfsr = parseInt(seed);
}

/// do one step in LFSR, changes inner state of LFSR
Linear_Feedback_Shift_Register.prototype.step = function(number) {
	if (!number) {
		number = 1;
	}
	var i = parseInt(number);
	if (1 > i) {
		i = 1;
	}
	var lfsr = this.lfsr;
	var bit	= 0;

	while (0<i) {
		/* taps: 16 14 13 11; feedback polynomial: x^16 + x^14 + x^13 + x^11 + 1 */
		bit = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5) ) & 1;
		lfsr = (lfsr >> 1) | (bit << 15);
		--i;
	}

	this.lfsr = lfsr;
	return this.lfsr;
};

/// get inner state
Linear_Feedback_Shift_Register.prototype.get = function() {
	return this.lfsr;
};

/// set inner state, can be used for reseed/restart
Linear_Feedback_Shift_Register.prototype.set = function(seed) {
	if (!seed) {
		seed = 1;
	}
	this.lfsr = parseInt(seed);
};

/******************************************************************************
* Methods for encoding and decoding arbitrary octet streams.
******************************************************************************/
/// constructor: LFSR seed as input
var Transcoder = function(seed) {
	if (!seed) {
		seed = 0xACE1; /* Any nonzero start state will work. */
	}
	this.start_state = parseInt(seed);
	this.LFSR = new Linear_Feedback_Shift_Register(this.start_state);
	this.period = 0;
	this.lfsr = this.LFSR.get();
}

/// helper method for checking period of LFSR
Transcoder.prototype.step_check_lfsr_period = function() { // linear feedback shift register
	var lfsr = this.LFSR.step();
	++this.period;
	if (lfsr == this.start_state) {
		return {"finished": true, "period": this.period, "lfsr": lfsr};
	}
	return {"finished": false, "period": this.period, "lfsr": lfsr};
}

/// resetting LFSR
Transcoder.prototype.reset = function() {
	this.LFSR.set(this.start_state);
}

Transcoder.prototype.encode_single_octet = function(byte) {
	return byte+1; // TODO, add LFSR and step
}

/// encode some message, including conversion to octet stream
Transcoder.prototype.encode = function(unicode) { // TODO probably initialize LFSR in some state?
	var data = unicodeStringToTypedArray(unicode);

	var self = this;
	Array.prototype.forEach.call(data, function (octet, i) {
        data[i] = self.encode_single_octet(octet);
    });

	return data;
}
/*****************************************************************************/

/******************************************************************************
* Tests
******************************************************************************/
/// entry point for tests
function tests_ok(show) {
	show("Starting internal selftest…");
	return test_dummy(show) && test_utf8_string_transcoder(show); // add further test with logical and for short circuit evaluation
}

/// root of tests
function test_dummy(show) {
	show("Running test_dummy.");
	return true;
}

/// testing utf8 string conversion
function test_utf8_string_transcoder(show) {
	show("Running test_utf8_string_transcoder.");
	var unicode = "I ½ ♥ 💩";
	var buf = unicodeStringToTypedArray(unicode);
	var arr = Array.prototype.slice.call(buf);
	// [73, 32, 194, 189, 32, 226, 153, 165, 32, 240, 159, 146, 169];
	var arr_ = [73, 32, 194, 189, 32, 226, 153, 165, 32, 240, 159, 146, 169];
	var data_ = new Uint8Array(arr_);
	var unicode_ = typedArrayToUnicodeString(data_); // "I ½ ♥ 💩";
	show(unicode, unicode_);
	if (unicode.length != unicode_.length) {
		show("String lengths don't match.");
		return false;
	}
	if (!unicode.endsWith(unicode_)) {
		show("String endings don't match.");
		return false;
	}
	show("At this place strings must match.");
	return true
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

	console.log(transcoder.encode("🏁 Ä Ö Ü ä ö ü ß € µ – · … Hallo Leute!")); // many special multibyte characters.
	tick();
}

window.onload = main;
