// 全局消息模型
class Message {
    constructor(platform, content){
        this.platform = platform; // 平台类型
        
        if(Object.prototype.toString.call(obj) === '[object Object]'){
            this.content = content; // 消息内容
        } else {
            throw new Error('content必须是对象');
        }
    }
}

// 用户模型
class User {
    constructor(nickname, id){
        this.nickname = nickname;
        this.id = id;
    }
}