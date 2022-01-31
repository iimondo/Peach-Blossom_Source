// "page": "background/background_main_page.html",

const date = new Date();
console.log("run background background_script: " + date.toLocaleTimeString()); 

// chrome.tabs.getSelected(null, function(tab) {
//     console.log(tab.url); // 当前页面url
// });

// chrome.runtime.onInstalled.addListener(details => {
//     console.log('previousVersion', details.previousVersion);
// });

// 图标显示控制
// chrome.runtime.onInstalled.addListener(function(){
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
//         chrome.declarativeContent.onPageChanged.addRules([
//             {
//                 conditions: [new chrome.declarativeContent.PageStateMatcher({
//                     pageUrl: {urlContains: "baidu.com"}
//                 })],
//                 actions: [new chrome.declarativeContent.ShowPageAction()]
//             }
//         ]);
//     });
// });

// 监听content-scripts & popup消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log('receive message: ' + JSON.stringify(request));
});