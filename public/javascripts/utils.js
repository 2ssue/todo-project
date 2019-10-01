export default class Util{
    $ = (selector, base=document) => base.querySelector(selector);
    $$ = (selector, base=document) => base.querySelectorAll(selector);
    
    regist(base, action, callback){
        base.addEventListener(action, callback);
    }

    post(url, body, header={'Content-Type': 'application/json'}){
        const postData = {
            method: 'POST', 
            body: JSON.stringify(body),
            headers: header
        }
        return new Promise((resolve, reject) => {
            fetch(url, postData).then((res) => {
                if(res.status === 200){
                    resolve(res);
                }else reject(res.statusText);
            }).catch(err => console.error(err));
        })
    }

    get(url){
        return new Promise((resolve, reject) => {
            fetch(url).then((res) => {
                if(res.status === 200){
                    resolve(res);
                }else reject(res.statusText);
            }).catch(err => console.error(err));
        })
    }
}
