function check_lfsr_period() { // linear feedback shift register
	var start_state = 0xACE1;  /* Any nonzero start state will work. */
    var lfsr = start_state;
    var bit;                    /* Must be 16bit to allow bit<<15 later in the code */
    var period = 0;

    do {
        /* taps: 16 14 13 11; feedback polynomial: x^16 + x^14 + x^13 + x^11 + 1 */
        bit  = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5) ) & 1;
        lfsr =  (lfsr >> 1) | (bit << 15);
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
