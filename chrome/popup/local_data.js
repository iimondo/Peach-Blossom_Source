// 将拉黑用户存储至本地
function store_block_user(user) {
    // {"key": "value"} sync & local
    chrome.storage.sync.set(user, null); // 第二个参数是function
}

// 存储过滤关键字
function store_filter_keyword(keyword) {

}

function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}ß