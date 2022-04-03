// 天涯看贴插件，最初源于看此贴:http://bbs.tianya.cn/post-house-252774-1.shtml
// let name = 'kkndme';

// 加入数据
browser.storage.local.get('tianya').then(item => {
    console.log(item);
    
    if(item.tianya !== null){
        filter_item(item.tianya);
    }
    
}, error => console.log(error));


// 处理条目
function filter_item(name){
    let list = [];
    
    [...document.querySelectorAll('.atl-main > .atl-item')].forEach(item=>{
        if(item.getAttribute('_host') !== name){
            list.push(item);
        }
    });

    while(list.length > 0){
        list.pop().remove();
    }
}


// 监听
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request == null){
        return;
    }
    
    // 消息添加过滤用户(只看只用户)
    browser.storage.local.set({"tianya": request.rule});
    
    filter_item(request.rule);
});


// 隐藏提示登录
document.querySelector('.bbs-login-tip').style.display = 'none';
