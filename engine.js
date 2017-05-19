function main() {
	console.log("HI");
	var text_block = document.querySelector('#text-block');
	console.log(text_block);
	if (text_block) {
		text_block.textContent = "INFO";
	}
}

window.onload = main;
