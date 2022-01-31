// 监听douban网站元素变动
// const mutationObserver = new MutationObserver(function(mutationsList, observer){
// 	console.log('listener...');
// });

// mutationObserver.observe(document.body, {
// 	'childList': true,
// 	'attributes': true,
// 	"subtree": true
// });

// __sidebar
console.log('wei bo');

let div_item_list = document.querySelectorAll('#scroller > .vue-recycle-scroller__item-wrapper > div');
if(div_item_list != null && div_item_list.length > 0){
	console.log(div_item_list);
	div_item_list[0].remove();
}
