// 获取本地数据
function loadLocalData(){
    browser.storage.local.get('filter_keyword').then(items => {
        if(JSON.stringify(items) !== "{}"){
            filterHotContent(items.filter_keyword.split(','));
        }
        console.log(items);
    }, error => console.log(error));
}


const keywords = ['羽生结弦','美国'];

// 微博内容为动态生成
let intervalID = setInterval(function(){
    let item_wrapper = document.querySelector('.vue-recycle-scroller__item-wrapper');
    if(item_wrapper !== null){
        clearInterval(intervalID);
        
        //filterHotContent(keywords, item_wrapper);
        
        //registerObserver();
    }
}, 100);


// 过滤热榜内容
function filterHotContent(filterKeyword, target){
    let cartItemList = target.querySelectorAll('.vue-recycle-scroller__item-view');
    
    cartItemList.forEach(item =>  {
        let cartTitle  = item.querySelector('.HotTopic_tit_eS4fv');
        
        if(cartTitle != null){
            // 如果包含过滤关键字，返回数组
            const result = filterKeyword.filter(keyword => {
                if(keyword.indexOf("/") === -1){ // 判断是否为正则
                    return cartTitle.innerText.indexOf(keyword) !== -1;
                }
                
                // 正则过滤
                return new RegExp(keyword.replaceAll("/","")).test(cartTitle.innerText);
            });
            
            if(Array.isArray(result) && result.length > 0){
                if(item.style.display !== 'none'){
                    item.style.display = 'none';
                }
                
            } else {
                if(item.style.display !== 'block'){
                    item.style.display = 'block';
                }
            }
        }
    });
}


// 注册观察
function registerObserver(){
    function callback(mutationList, observer) {
      mutationList.forEach((mutation) => {
        switch(mutation.type) {
            case 'attributes':
                filterHotContent(keywords, mutation.target);
                console.log(mutation);
              break;
        }
      });
    }

    var observer = new MutationObserver(callback);
    observer.observe(
                     document.querySelector('.vue-recycle-scroller__item-wrapper'),
                     {
                        attributes: true,
                        //attributeFilter: ["transform"],
                        childList: true,
                        subtree: true
                     }
                     );
}
