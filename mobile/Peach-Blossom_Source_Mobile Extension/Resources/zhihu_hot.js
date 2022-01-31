let filterKeyword = [
    "党",
    "总书记",
    "习近平",
    "中共中央",
    "冬奥会",
    "俄罗斯",
    "美国",
    "发展思想"
];

let cartItemList = document.querySelectorAll('.App-main a'); // item
let removeCartItem = [];

// delete button
document.querySelector('.OpenInAppButton').remove();

cartItemList.forEach(item =>  {

    let cartTitle  = item.querySelector('h1');
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
