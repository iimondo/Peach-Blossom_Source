let filterKeyword = [
    "党",
    "总书记",
    "习近平",
    "中共中央",
    "人民群众",
    "始终坚持以",
    "冬奥会",
    "俄罗斯",
    "美国",
    "发展思想"
];

let cartItemList = document.querySelectorAll('.card-list > div'); // item
//let cartItemTtitleList = document.querySelectorAll('.card-list > div .m-text-cut'); // title

let removeCartItem = [];

cartItemList.forEach(item =>  {

    let cartTitle  = item.querySelector('.m-text-cut');
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
