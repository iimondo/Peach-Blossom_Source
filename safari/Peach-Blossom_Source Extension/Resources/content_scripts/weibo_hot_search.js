let local_filter_keywords = [];

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
    browser.storage.local.get('filter_keyword').then(items => {
        console.log(`过滤关键字：${JSON.stringify(items.filter_keyword)}`);
        if(JSON.stringify(items) !== "{}"){
            local_filter_keywords = items.filter_keyword.split(',');
            
            // 初始过滤显示内容
            filterVisibContent();
        }
        
    }, error => console.log(error));
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
    let itemFlex = item.querySelector('.HotTopic_tit_eS4fv'); // .woo-box-item-flex
 
    if(itemFlex == null){
        console.log('filterContent_().itemFlex not found');
        return false;
    }
    
    const filter_result = filterKeyword.filter(keyword => {
        if(keyword.indexOf("/") === -1){ // 判断是否为正则
            return itemFlex.innerText.indexOf(keyword) !== -1;
        }
        
        // 正则过滤
        return new RegExp(keyword.replaceAll("/","")).test(itemFlex.innerText);
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
