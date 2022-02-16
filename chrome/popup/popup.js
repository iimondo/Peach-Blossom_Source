let but_filter = document.getElementById('but_filter');
let filter_content = document.getElementById('filter_content');
let expire = document.getElementById('expire');
let platform = document.getElementById('application_platform');

but_filter.onclick = function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                "rule": filter_content.value,
                "expire": expire.value, // 过期时间，默认无限
                "platform": platform[platform.selectedIndex].value // zhihu, weibo, all
            },
            null
        );
    });
}