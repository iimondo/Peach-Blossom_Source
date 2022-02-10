console.log('douban');

// 过滤推荐内容
function filterContent(filterKeyword){
    let removeCartItem = [];
    let cartItemRecommendList = document.querySelectorAll('.stream-items > div');
    console.log(cartItemRecommendList)
    cartItemRecommendList.forEach(item =>  {
        let cartTitle  = item.querySelector('blockquote > p'); // 单独内容
        console.log(cartTitle)
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
