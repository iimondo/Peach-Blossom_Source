// 价格比较插件
console.log("content_scripts run sucess!");

switch(window.location.host + window.location.pathname){
        // https://uniqlo.tmall.com/p/rd745470.htm?spm=a1z10.4-b-s.w4007-24282587170.65.339d45e113h2Bz
        case "uniqlo.tmall.com/p/rd745470.htm": // 优衣库外套
            uniqlo("uniqlo_coats");
        break;
        
        // https://uniqlo.tmall.com/p/rd471008.htm?spm=a1z10.4-b-s.w4007-24282587170.71.339d45e113h2Bz
        case "uniqlo.tmall.com/p/rd471008.htm": // 优衣库长裤&休闲裤
            //uniqlo_trousers();
            uniqlo("uniqlo_trousers");
        break;
                
        //https://gucn.tmall.com/category-1401581563.htm?spm=a1z10.5-b-s.w4011-14435693512.78.2ecc710ejRofSl&scene=taobao_shop&catId=1401581563&pageNo=1&viewType=grid
        case "gucn.tmall.com/category-1401581563.htm": // GU(极优) 男装
            gucnMen();
        break;
}


// 序列化
function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

// 反序列化
function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

console.log("-------------------------------------------------------------------------");
function uniqlo(storageKeyName){
    console.log("uniqlo() run sucess!");
    
    // 获取当前服装数据并映射
    let currentMap = new Map();
    [...document.querySelectorAll(".skin-box-bd .item")].forEach(item =>
                    currentMap.set(item.querySelector(".detail > .item-name").href, item));
    
    browser.storage.local.get().then(storageLocal => {
        console.log(storageLocal);
        
        if(storageLocal[storageKeyName] !== undefined
                && JSON.stringify(storageLocal[storageKeyName]) !== "{}"){ // 己有本地数据，比较
            
            let localMap = JSON.parse(storageLocal[storageKeyName], reviver);
            localMap.forEach((value, key) => {
                let item = currentMap.get(key);
                if(item !== undefined){
                    let priceDOM = item.querySelector(".detail .c-price");
                    let currentPrice = Number.parseFloat(priceDOM.innerText);
                    if(currentPrice < value){
                        item.style.border = "1px solid red";
                        priceDOM.innerText = `${currentPrice}（原价：¥${value}）`;
                    }
                }
            });
            
        } else {
            browser.storage.local.set({storageKeyName: JSON.stringify(currentMap, replacer)});
            console.log("初次访问已存储数据");
        }
        
        console.log("uniqlo().storage.local >>> finish!");
        
    }, error => console.error(`browser.storage.local错误：${error}`));
}


function uniqlo_trousers(){
    console.log("uniqlo_trousers() run sucess!");
    
    let trousersMap = new Map();
    [...document.querySelectorAll(".skin-box-bd .item")].forEach(item => {
        let link = item.querySelector(".detail > .item-name").href; // 商品链接
        let price = Number.parseFloat(item.querySelector(".detail .c-price").innerText); // 价格

        trousersMap.set(link, price);
    });
    
    browser.storage.local.get().then(storageLocal => {
        console.log(storageLocal);
        if(storageLocal.uniqlo_trousers !== undefined
                && JSON.stringify(storageLocal.uniqlo_trousers) !== "{}"){ // 己有本地数据，比较
            
            let localTrousersMap = JSON.parse(storageLocal.uniqlo_trousers, reviver);
            localTrousersMap.forEach((value, key) =>
                                 console.log(trousersMap.get(key) < value ? `原价${value},现价${trousersMap.get(key)},${key}` : "休闲裤，未减价"));
        } else {
            browser.storage.local.set({"uniqlo_trousers": JSON.stringify(trousersMap, replacer)});
            console.log("初次访问已存储数据");
        }
    }, error => console.log(error`browser.storage.local错误：${error}`));
    
    console.log("uniqlo_coats() run finish!");
}


function gucnMen(){
    console.log("gucnMen() run sucess!");
    
}











//// 天涯看贴插件，最初源于看此贴:http://bbs.tianya.cn/post-house-252774-1.shtml
//// let name = 'kkndme';
//
//// 加入数据
//browser.storage.local.get('tianya').then(item => {
//    console.log(item);
//
//    if(item.tianya !== null){
//        filter_item(item.tianya);
//    }
//
//}, error => console.log(error));
//
//
//// 处理条目
//function filter_item(name){
//    let list = [];
//
//    [...document.querySelectorAll('.atl-main > .atl-item')].forEach(item => {
//        if(name !== '*' && item.getAttribute('_host') !== name){
//            list.push(item);
//        }
//    });
//
//    while(list.length > 0){
//        list.pop().remove();
//    }
//}
//
//
//// 监听
//browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//    if(request == null){
//        return;
//    }
//
//    // 消息添加过滤用户(只看只用户)
//    browser.storage.local.set({"tianya": request.rule});
//
//    filter_item(request.rule);
//});
//
//
//// 隐藏提示登录
//document.querySelector('.bbs-login-tip').style.display = 'none';
