'use strict';


/* code from
* https://coolaj86.com/articles/unicode-string-to-a-utf-8-typed-array-buffer-in-javascript/
*/
// string to uint array
function unicodeStringToTypedArray(s) {
    var escstr = encodeURIComponent(s);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua;
}

// uint array to string
function typedArrayToUnicodeString(ua) {
    var binstr = Array.prototype.map.call(ua, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    var escstr = binstr.replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(p).toString(16).toUpperCase();
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

/// encode some message, including conversion to octet stream
Transcoder.prototype.encode = function(message) {
//  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
//  var bufView = new Uint16Array(buf);
//  for (var i=0, strLen=str.length; i<strLen; i++) {
//    bufView[i] = str.charCodeAt(i);
//  }
//  return buf;
	var buf = new ArrayBuffer(strLen*2); // TODO wchar is wrong assumption with variable multibyte chars
	var str = message.toString();  // TODO
	console.log("AA: ",str);  // TODO
	var strLen = str.length;  // TODO
	var result = Uint8Array.from(str); // TODO
	for (var i = 0, len = result.length; i < len; i++) { // TODO
		result[i] = str.charCodeAt(i); // TODO doesn't work as expected??
	}
	return result; //result.toString();
}
/*****************************************************************************/

/*****************************************************************************/
function tests_ok() {
	var result = true;
	result |= test_utf8_string_transcoder();
	if (!result) return false;
}

function test_utf8_string_transcoder() {
	var unicode = "I ½ ♥ 💩";
	var buf = unicodeStringToTypedArray(unicode);
	var arr = Array.prototype.slice.call(buf);
	// [73, 32, 194, 189, 32, 226, 153, 165, 32, 240, 159, 146, 169];
	var arr_ = [73, 32, 194, 189, 32, 226, 153, 165, 32, 240, 159, 146, 169];
	var data_ = new Uint8Array(arr_);
	var unicode_ = typedArrayToUnicodeString(data_); // "I ½ ♥ 💩";
	if (unicode != unicode_) {
		return false;
	}
	return true
}
/*****************************************************************************/

/// our entry point
function main() {
	console.log("HI");
	if (!tests_ok()) {
		console.log("Some Tests failed. Stopping.");
	}
	var text_block = document.querySelector('#text-block');
	console.log(text_block);

	var show = function(message) {
		if (text_block) {
			text_block.innerHTML = message;
		}
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
