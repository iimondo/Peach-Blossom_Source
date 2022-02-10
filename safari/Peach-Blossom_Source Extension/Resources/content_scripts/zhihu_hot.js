let cartItemList = document.querySelectorAll('#TopstoryContent section'); // 热门搜索

// 获取本地数据
function loadLocalData(){
    browser.storage.local.get('filter_keyword').then(items => {
        if(JSON.stringify(items) !== "{}"){
            filterHotContent(items.filter_keyword.split(','));
        }
        console.log(items);
    }, error => console.log(error));
}

// 过滤热榜内容
function filterHotContent(filterKeyword){
    let removeCartItem = [];
    
    cartItemList.forEach(item =>  {
        let cartHref  = item.querySelector('a');
        let cartTitle  = item.querySelector('h2');
        
        if(cartTitle != null){
            const result = filterKeyword.filter(keyword => {
                if(keyword.indexOf("/") === -1){ // 判断是否为正则
                    return cartTitle.innerText.indexOf(keyword) !== -1;
                }
                
                // 正则过滤
                return new RegExp(keyword.replaceAll("/","")).test(cartTitle.innerText);
            });
            
            if(Array.isArray(result) && result.length > 0){
                removeCartItem.push(item);
            }
        }
    });

    while(removeCartItem.length > 0){
        removeCartItem.pop().remove();
    }
}

// 过滤推荐内容
function filterContent(filterKeyword){
    let removeCartItem = [];
    let cartItemRecommendList = document.querySelectorAll('.Topstory-recommend .TopstoryItem'); // 推荐条目
    
    cartItemRecommendList.forEach(item =>  {
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
                items = [...new Set(keyword_array)].join(',');
            }
            
            browser.storage.local.set({"filter_keyword": items});
            filterHotContent(items.split(','));
            
        }, error => console.log(error));
    }
    
    // sendResponse('我收到了你的消息！');
});


loadLocalData();


// 监听导航改变
function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    switch(mutation.type) {
      case 'childList':
            console.log('child_list', mutation);
            
            let listShortcut = document.querySelector('#TopstoryContent > .ListShortcut');
            let hotList = listShortcut.querySelector('.HotList');
            let topstory_recommend = listShortcut.querySelector('.Topstory-recommend');
            let topstory_follow = listShortcut.querySelector('.Topstory-follow');
            
            if(mutation.addedNodes.length > 0){
                if(hotList !== null ){
                    console.log('hotList');
                    
                } else if(topstory_recommend !== null){
                    console.log('topstory_recommend');
                    
                } else if(topstory_follow !== null){
                    console.log('topstory_follow');
                }
            }
        
        break;
    }
  });
}

//var observer = new MutationObserver(callback);
//observer.observe(document.querySelector('#TopstoryContent'), { attributes: true, childList: true, subtree: false });


// 监听子条目增减, 只过滤单个内容
//var observer = new MutationObserver(callback);
//observer.observe(document.querySelector('#TopstoryContent > .ListShortcut > .Topstory-recommend > div'),
//                 { attributes: true, childList: true, subtree: false });
