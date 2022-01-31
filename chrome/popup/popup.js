let but_block = document.getElementById('but_block');
let input_name = document.getElementById('name');

but_block.onclick = function () {

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

		chrome.tabs.sendMessage(
			tabs[0].id,
			// ew Message('douban_grpup', new User(input_name.value, 0)), // nodo: error
			{ "message": input_name.value },
			null
		);

	});

}