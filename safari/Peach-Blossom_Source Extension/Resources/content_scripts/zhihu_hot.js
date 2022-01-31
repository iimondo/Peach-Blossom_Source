//browser.storage.sync.remove("filter_keyword");

let cartItemList = document.querySelectorAll('#TopstoryContent section'); // item
let removeCartItem = [];

// 获取本地数据
function loadLocalData(){
    browser.storage.local.get('filter_keyword').then(items => {
        if(JSON.stringify(items) !== "{}"){
            filterHotContent(items.filter_keyword.split(','));
        }
        
    }, error => console.log(error));
}

// 过滤热榜内容
function filterHotContent(filterKeyword){
    cartItemList.forEach(item =>  {
        let cartTitle  = item.querySelector('h2');
        if(cartTitle != null){
            const result = filterKeyword.filter(keyword => cartTitle.innerText.indexOf(keyword) !== -1);
            if(Array.isArray(result) && result.length > 0){
                removeCartItem.push(item);
            }
        }
    });

    while(removeCartItem.length > 0){
        removeCartItem.pop().remove();
    }
}

// 监听添加过滤词
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request != null && request.platform == 'zhihu') {
        browser.storage.local.get('filter_keyword').then(items => {
            if(JSON.stringify(items) === "{}"){
                items = request.message;
                
            } else {
                let keyword_array = items.filter_keyword.split(',');
                keyword_array.push(request.message);
                items = keyword_array.join(','); // 应该去重复
            }
            
            browser.storage.local.set({"filter_keyword": items});
            filterHotContent(items.split(','));
            
        }, error => console.log(error));
    }
    
    // sendResponse('我收到了你的消息！');
});


loadLocalData();
console.log('zhihu hot');
