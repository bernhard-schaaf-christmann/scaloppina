/*****************************************************************************/
Linear_Feedback_Shift_Register = function(seed) {
	if (!seed) {
		seed = 1;
	}
	this.lfsr = parseInt(seed);
}

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

Linear_Feedback_Shift_Register.prototype.get = function() {
	return this.lfsr;
};
/*****************************************************************************/


/*****************************************************************************/
Transcoder = function(seed) {
	if (!seed) {
		seed = 0xACE1; /* Any nonzero start state will work. */
	}
	this.start_state = parseInt(seed);
	this.LFSR = new Linear_Feedback_Shift_Register(this.start_state);
}

Transcoder.prototype.check_lfsr_period = function() { // linear feedback shift register
	var LFSR = new Linear_Feedback_Shift_Register(this.start_state);

    var period = 0;
	var lfsr = LFSR.get();

    do {
		lfsr = LFSR.step();
        ++period;
    } while (lfsr != this.start_state);

    return period;
}
/*****************************************************************************/

function main() {
	console.log("HI");
	var text_block = document.querySelector('#text-block');
	console.log(text_block);
	var transcoder = new Transcoder()
	if (text_block) {
		text_block.textContent = "Starte Berechnung…";
		var period = transcoder.check_lfsr_period();
		text_block.textContent = "Linear Feedback Shift Register-Periode = "+period;
	}
}

window.onload = main;
