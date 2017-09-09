function main() {
	var text_area = document.querySelector('#text_area');
	var info_box = document.querySelector('#info_box');

	text_area.innerHTML = final_display_data.text;
	info_box.innerHTML = final_display_data.statistics;
}

window.onload = main;
