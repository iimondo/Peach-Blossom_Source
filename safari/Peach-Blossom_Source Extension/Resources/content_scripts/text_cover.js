// 过滤关键字
let filter_text = [
    '美国|俄国', '俄罗斯|乌克兰', '泽连斯基', '台湾',// 国际政治
    '大学|裁员', // 生活
    '程序员', // 职业
    '(?=.*重庆)(?=.*星巴克)'
];


[...document.querySelectorAll('*')].filter(node => {
        if(node.children.length == 0) {
            return filter_text.filter(keyword => new RegExp(keyword).test(node.innerText)).length > 0;
        }
        
        return false;
    })
        .forEach(node => {
            node.style.color = '#000';
            node.style.backgroundColor = '#000';
            
            // 日志
            console.log(node);
        });
