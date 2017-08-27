/******************************************************************************
* Class encapsulating a LFSR in Fibonacci form
******************************************************************************/

/// Constructor: seed is starting value
Linear_Feedback_Shift_Register = function(seed) {
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
Transcoder = function(seed) {
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
	var str = message.toString();
	var result = Uint8Array.from(str);
	for (var i = 0, len = result.length; i < len; i++) {
//		result[i] = i;//32+str[i]; // TODO doesn't work as expected??
	}
	return result.toString();
}
/*****************************************************************************/

/// our entry point
function main() {
	console.log("HI");
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

	console.log(transcoder.encode("Hallo Leute!"));
	tick();
}

window.onload = main;
