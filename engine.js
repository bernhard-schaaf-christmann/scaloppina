Linear_Feedback_Shift_Register = function(seed) {
	if (!seed) {
		seed = 1;
	}
	this.lfsr = parseInt(seed);
}

Linear_Feedback_Shift_Register.prototype.step = function() {
	/* taps: 16 14 13 11; feedback polynomial: x^16 + x^14 + x^13 + x^11 + 1 */
	var lfsr = this.lfsr;
	var bit = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5) ) & 1;
	this.lfsr = (lfsr >> 1) | (bit << 15);
	return this.lfsr;
};

Linear_Feedback_Shift_Register.prototype.get = function() {
	return this.lfsr;
};


function check_lfsr_period() { // linear feedback shift register
	var start_state = 0xACE1;  /* Any nonzero start state will work. */
	var LFSR = new Linear_Feedback_Shift_Register(start_state);

//    var lfsr = start_state;
//    var bit;                    /* Must be 16bit to allow bit<<15 later in the code */
    var period = 0;
	var lfsr = LFSR.get();

    do {
        /* taps: 16 14 13 11; feedback polynomial: x^16 + x^14 + x^13 + x^11 + 1 */
//        bit  = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5) ) & 1;
//        lfsr =  (lfsr >> 1) | (bit << 15);
		lfsr = LFSR.step();
        ++period;
    } while (lfsr != start_state);

    return period;
}

function main() {
	console.log("HI");
	var text_block = document.querySelector('#text-block');
	console.log(text_block);
	if (text_block) {
		text_block.textContent = "Starte Berechnung…";
		var period = check_lfsr_period();
		text_block.textContent = "Linear Feedback Shift Register-Periode = "+period;
	}
}

window.onload = main;
