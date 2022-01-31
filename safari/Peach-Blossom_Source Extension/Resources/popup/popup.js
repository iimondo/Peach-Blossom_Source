//let but_block = document.getElementById('but_block');
//let input_name = document.getElementById('name');
let but_filter = document.getElementById('but_filter');
let filter_content = document.getElementById('filter_content');

//but_block.onclick = function () {
//    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//        browser.tabs.sendMessage(
//            tabs[0].id,
//            { "message": input_name.value, "platform": "douban" },
//            null
//        );
//    });
//}

but_filter.onclick = function () {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(
            tabs[0].id,
            { "message": filter_content.value, "platform": "zhihu" },
            null
        );
    });
}
