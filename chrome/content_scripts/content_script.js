// 发消息
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOMContentLoaded, 我被执行了!');

	// 发消息给background
	chrome.runtime.sendMessage({message: "`content script` send message"}, function(response){
		// response: background回复
	});
});