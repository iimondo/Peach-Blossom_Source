let filterKeyword = [
    "党",
    "总书记",
    "习近平",
    "中共中央",
    "人民群众",
    "始终坚持以",
    "发展思想",
    "冬奥会",
    
    "俄罗斯",
    "美国",
    "乌克兰"
];

let removeCartItem = [];
let cartItemList = document.querySelectorAll('.vue-recycle-scroller__item-wrapper > .vue-recycle-scroller__item-view');

cartItemList.forEach(item =>  {

    let cartTitle  = item.querySelector('h2');
    if(cartTitle != null){
        const result =  filterKeyword.filter(keyword => cartTitle.innerText.indexOf(keyword) !== -1);
        console.log(result);
        if(result != null && result.length > 0){
            removeCartItem.push(item);
        }
    }

});

console.log(removeCartItem);

while(removeCartItem.length > 0){
    removeCartItem.pop().remove();
}
