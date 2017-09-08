'use strict';

var btoa = require('btoa');

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
	var state = this.LFSR.step(byte); // run through the states
	return state & 0xFF;
}

/// encode some message, including conversion to octet stream
Transcoder.prototype.encode_to_array_further = function(unicode) {
	var data = unicodeStringToTypedArray(unicode);

	var self = this;
	Array.prototype.forEach.call(data, function (octet, i) {
        data[i] = self.encode_single_octet(octet);
    });

	return data;
}

Transcoder.prototype.encode_to_array = function(unicode) {
	this.reset();
	this.encode_to_array_further(unicode);
	return this.encode_to_array_further(unicode);
}

Transcoder.prototype.to_base64 = function(uint8array) {
	var binary = '';
	var bytes = new Uint8Array( uint8array );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

Transcoder.prototype.encode = function(unicode) {
	return this.to_base64(this.encode_to_array(unicode+unicode));
}
/*****************************************************************************/

module.exports = Transcoder;

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
