console.log('douban');

let tr_list = document.querySelectorAll('.olt > tbody > tr');

// 拉黑用户
function block_user(nickname) {
	if (tr_list != null) {
		tr_list.forEach(element => {
			let element_td_list = element.querySelectorAll('td');
			// 标题
			let element_title = element_td_list[0].querySelector('a');
			if (element_title != null) {
				// 查询屏蔽关键字 & 用户屏蔽
				console.log(element_title.innerText);
			}

			// 获取用户id
			let element_user = element_td_list[1].querySelector('a');
			if (element_user != null) {
				// console.log(element_user.href, element_user.innerText); // id, nickname
				if (element_user.innerText == nickname) {
					element.remove(); // 删除自身
				}
			}
		});
	}
}

// 互动消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request != null) {
		// block_user(request.content.nickname); // nodo: error
		block_user(request.message);
	}

	// sendResponse('我收到了你的消息！');
});