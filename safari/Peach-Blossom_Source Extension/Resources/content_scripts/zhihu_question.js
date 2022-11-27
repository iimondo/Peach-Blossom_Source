let local_filter_keywords = [{
    "rule":'/国足/',
    "expire":""
}];

// 获取本地数据
function loadLocalData(){
    browser.storage.local.get('zhihu_question_keyword').then(items => {
        if(JSON.stringify(items) !== "{}"){
            //local_filter_keywords = clear_expire_rule(items.filter_keyword);
            console.log('有效关键字', local_filter_keywords, items.filter_keyword);
            
            filterHotContent(local_filter_keywords, document.querySelectorAll('#QuestionAnswers-answers .List-item'));
        }

        //register_element_observer();
        
    }, error => console.log(error));
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
    let cartTitle = element.querySelector('.RichContent'); // .RichContent
    
    if(cartTitle == null){
        console.log('filterHotContent_().cartTitle not found');
        return false;
    }
    
    // 判断是否要过滤
    const filter_result = filterKeyword
                           // .filter(item => (item.platform == 'zhihu' || item.platform == 'all')) // 过滤平台
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
element_observer.observe(
                document.querySelectorAll('#QuestionAnswers-answers .List > div')[1],
                 { attributes: true, childList: true, subtree: false });


loadLocalData();
