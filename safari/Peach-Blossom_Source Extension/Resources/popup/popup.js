let but_filter = document.getElementById('but_filter');
let filter_content = document.getElementById('filter_content');
let expire = document.getElementById('expire');
let platform = document.getElementById('application_platform');

but_filter.onclick = function () {
    // 1. 添加时过滤重复字符
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(
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


//function getPlatform(url){
//    switch(url){
//        case 'https://www.zhihu.com':
//        case 'https://www.zhihu.com/hot':
//        case 'https://www.zhihu.com/follow':
//            return 'zhihu';
//
//        case 'https://weibo.com/hot/search':
//        case 'https://weibo.com/hot/topic':
//            return 'weibo';
//    }
//
//    throw new Error('get platform is none');
//}
