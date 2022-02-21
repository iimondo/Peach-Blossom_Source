let local_filter_keywords = [];


// 页面关闭时，重新设置数据
window.addEventListener('unload', function(event) {
    browser.storage.local.set({"filter_keyword": local_filter_keywords});
    
    event.preventDefault();
    event.returnValue = '';
});


// 获取本地数据
function loadLocalData(){
    browser.storage.local.get('filter_keyword').then(items => {
        if(JSON.stringify(items) !== "{}"){
            local_filter_keywords = clear_expire_rule(items.filter_keyword);
            console.log('有效关键字', local_filter_keywords, items.filter_keyword);
            
            filterHotContent(local_filter_keywords, getContainerElement()); 
        }

        register_element_observer();
        
    }, error => console.log(error));
}


// 清除过期数据, 返回为不过期数据
function clear_expire_rule(datas){
   return datas
            .filter(item => {
                if(item.expire == ""){ // 默认永久时间
                    return true;
                }
       
                return new Date(item.expire.replace(/-/g,'/')).getTime() > new Date().getTime();
            });
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
    
    // 视频全部过滤
    if(element.querySelector('.VideoAnswerPlayer') != null
            || element.querySelector('.ZVideoItem-player') != null){
        console.log(`过滤视频：${cartTitle.innerText}`);
        return true;
    }
    
    // 判断是否要过滤
    const filter_result = filterKeyword
                            .filter(item => (item.platform == 'zhihu' || item.platform == 'all')) // 过滤平台
                            .filter(item => {
                                    if(item.rule.indexOf("/") === -1){ // 判断是否为正则
                                        return cartTitle.innerText.indexOf(item.rule) !== -1;
                                    }
        
                                // 正则过滤
                                return new RegExp(item.rule.replaceAll("/","")).test(cartTitle.innerText);
                            });
    
    // 结果为包含过滤关键字数组
    if(Array.isArray(filter_result) && filter_result.length > 0){
        console.log(`关键字：${JSON.stringify(filter_result)}\n内容：${cartTitle.innerText}`);
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
    if(request == null){
        return;
    }
    
    let filter_reulst = local_filter_keywords.filter(item => item.rule == request.rule);
    if(filter_reulst.length <= 0){
        local_filter_keywords.push(request);
        
        //browser.storage.local.set({"filter_keyword": local_filter_keywords});
        
        filterHotContent(local_filter_keywords, getContainerElement());
    }
    
});


// init
loadLocalData();
