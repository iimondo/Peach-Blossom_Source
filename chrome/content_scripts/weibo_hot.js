let local_filter_keywords = [];


window.addEventListener('unload', function(event) {
    chrome.storage.local.set({"filter_keyword": local_filter_keywords});
    
    event.preventDefault();
    event.returnValue = '';
});


// 微博内容为动态生成
let intervalID = setInterval(function(){
    let item_wrapper = document.querySelector('.vue-recycle-scroller__item-wrapper');
    if(item_wrapper !== null){
        clearInterval(intervalID);
        loadLocalData();
        registerObserver();
    }
}, 100);


// 获取本地数据
function loadLocalData(){
    chrome.storage.local.get('filter_keyword', function(items){
        if(JSON.stringify(items) !== "{}"){
            local_filter_keywords = clear_expire_rule(items.filter_keyword);
            console.log('有效关键字', local_filter_keywords, items.filter_keyword);
            
            // 初始过滤显示内容
            filterVisibContent();
        }
    });
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


// 监听内容改变
function registerObserver(){
    function callback(mutationList, observer) {
      mutationList.forEach((mutation) => {
        switch(mutation.type) {
            case 'attributes':
                filterVisibContent();
                break;
        }
      });
    }

    let observer = new MutationObserver(callback);
    let target = document.querySelector('.vue-recycle-scroller__item-wrapper');
    let options = {
        subtree: true,
        attributeOldValue: true,
        attributeFilter: [ "data-index" ]
    }
    
    observer.observe(target, options);
}


// 过滤可见所有条目
function filterVisibContent(){
    let itemList = document.querySelectorAll('.vue-recycle-scroller__item-view');
    itemList.forEach(item => filterContent_(local_filter_keywords, item));
}


// 过滤单个内容
function filterContent_(filterKeyword, item){
    let itemFlex = item.querySelector('.woo-box-item-flex'); // .HotTopic_tit_eS4fv
 
    if(itemFlex == null){
        console.log('filterContent_().itemFlex not found');
        return false;
    }
    
    // 判断是否要过滤
    const filter_result = filterKeyword
                            .filter(item => (item.platform == 'weibo' || item.platform == 'all'))
                            .filter(item => {
                                    if(item.rule.indexOf("/") === -1){ // 判断是否为正则
                                        return itemFlex.innerText.indexOf(item.rule) !== -1;
                                    }
        
                                // 正则过滤
                                return new RegExp(item.rule.replaceAll("/","")).test(itemFlex.innerText);
                            });
        
    // 结果为包含过滤关键字数组
    if(Array.isArray(filter_result) && filter_result.length > 0){
        item.style.display = 'none';
        printFilterInfo(filter_result, item);
        return;
    }
    
    if(item.style.display === 'none'){
        item.style.display = 'block';
    }
}


// 打印过滤信息
function printFilterInfo(keywords, element){
    let index = -1;
    let item = element.querySelector('.wbpro-scroller-item');
    
    if(item != null){
        index = item.getAttribute('data-index');
    }
    
    let title = element.querySelector('.HotTopic_tit_eS4fv').innerText;
    console.log(`关键字：${keywords}\n位置：${index}\n标题：${title}`);
}


// 监听添加过滤词
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request == null){
        return;
    }
    
    let filter_reulst = local_filter_keywords.filter(item => item.rule == request.rule);
    if(filter_reulst.length <= 0){
        local_filter_keywords.push(request);
        
        //chrome.storage.local.set({"filter_keyword": local_filter_keywords});
        
        filterVisibContent();
    }
    
});
