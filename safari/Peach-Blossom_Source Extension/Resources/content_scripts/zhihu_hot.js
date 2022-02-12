let local_filter_keywords = [];


// 获取本地数据
function loadLocalData(){
    browser.storage.local.get('filter_keyword').then(items => {
        console.log(`过滤关键字：${JSON.stringify(items.filter_keyword)}`);
        
        if(JSON.stringify(items) !== "{}"){
            local_filter_keywords = items.filter_keyword.split(',');
            
            filterHotContent(local_filter_keywords, getContainerElement());
            
            register_element_observer();
        }
        
    }, error => console.log(error));
}


// 返回当前列表的容器
function getContainerElement(){
    let listShortcut = document.querySelector('#TopstoryContent > .ListShortcut');
    let hotList = listShortcut.querySelector('.HotList');
    let topstory_recommend = listShortcut.querySelector('.Topstory-recommend');
    let topstory_follow = listShortcut.querySelector('.Topstory-follow');
    
    if(hotList !== null ){
        return hotList.querySelectorAll('section');
            
    } else if(topstory_recommend !== null){
        return topstory_recommend.querySelectorAll('.TopstoryItem');
            
    } else if(topstory_follow !== null){
        return topstory_follow;
    }
    
    return null;
}


// 过滤内容
function filterHotContent(filterKeyword, elements){
    let removeCartItem = [];
    
    elements.forEach(item =>  {
        let is_filter = filterHotContent_(filterKeyword, item);
        if(is_filter){
            removeCartItem.push(item);
        }
    });

    while(removeCartItem.length > 0){
        removeCartItem.pop().remove();
    }
}


// 过滤单个内容，返回true则过滤
function filterHotContent_(filterKeyword, element){
    let cartTitle = element.querySelector('h2');
    
    if(cartTitle == null){
        console.log('filterHotContent_().cartTitle not found');
        return false;
    }
    
    const filter_result = filterKeyword.filter(keyword => {
        if(keyword.indexOf("/") === -1){ // 判断是否为正则
            return cartTitle.innerText.indexOf(keyword) !== -1;
        }
        
        // 正则过滤
        return new RegExp(keyword.replaceAll("/","")).test(cartTitle.innerText);
    });
        
    // 结果为包含过滤关键字数组
    if(Array.isArray(filter_result) && filter_result.length > 0){
        console.log(`关键字：${filter_result}\n内容：${cartTitle.innerText}`);
        return true;
    }
}


// 监听导航改变
(function(){
    function navgation_callback(mutationList, observer) {
      mutationList.forEach((mutation) => {
        switch(mutation.type) {
          case 'childList':
                if(mutation.addedNodes.length > 0){
                    filterHotContent(local_filter_keywords, getContainerElement());
                }
        
                // 注册添加监听
                register_element_observer();
            break;
        }
      });
    }

    let navgation_observer = new MutationObserver(navgation_callback);
    navgation_observer.observe(document.querySelector('#TopstoryContent'), { attributes: true, childList: true, subtree: false });
}());


// 监听动态添加
    function element_callbac(mutationList, observer) {
        mutationList.forEach((mutation) => {
          switch(mutation.type) {
            case 'childList':
                  if(mutation.addedNodes.length > 0){
                      filterHotContent(local_filter_keywords, mutation.addedNodes);
                  }
              break;
          }
        });
    }

let element_observer = new MutationObserver(element_callbac);

function register_element_observer(){
    element_observer.disconnect();
    
    switch(window.location.href){
        case "https://www.zhihu.com/follow":
            element_observer.observe(
                            document.querySelector('#TopstoryContent > .ListShortcut > .Topstory-follow > div'),
                             { attributes: true, childList: true, subtree: false });
        break;
            
        case "https://www.zhihu.com/":
            element_observer.observe(
                            document.querySelector('#TopstoryContent > .ListShortcut > .Topstory-recommend > div'),
                             { attributes: true, childList: true, subtree: false });
        break;
            
        case "https://www.zhihu.com/hot":
            element_observer.observe(
                            document.querySelector('#TopstoryContent > .ListShortcut > .HotList > div'),
                             { attributes: true, childList: true, subtree: false });
        break;
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
            
            local_filter_keywords = items;
            browser.storage.local.set({"filter_keyword": items});
            
            filterHotContent(items.split(','), getContainerElement());
            
        }, error => console.log(error));
    }
    // sendResponse('我收到了你的消息！');
});


// init
loadLocalData();
