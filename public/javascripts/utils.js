export const $ = (selector, base=document) => base.querySelector(selector);
export const $$ = (selector, base=document) => base.querySelectorAll(selector);
    
export function regist(base, action, callback){
        base.addEventListener(action, callback);
    }

export function post(url, body, header={'Content-Type': 'application/json'}){
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

export function get(url){
        return new Promise((resolve, reject) => {
            fetch(url).then((res) => {
                if(res.status === 200){
                    resolve(res);
                }else reject(res.statusText);
            }).catch(err => console.error(err));
        })
    }

export function templateJsonToTable(json, headers){
        const array = JSON.parse(json);
        let tableElement = '<table>';
        
        if(headers){
            tableElement += '<tr>';
            headers.forEach(element => {
                tableElement += '<th>';
                tableElement += element;
                tableElement += '</th>';
            });
            tableElement += '</tr>';
        }
        
        array.forEach(element => {
            tableElement += '<tr>';
            for(let key in element){
                tableElement += `<td>${element[key]}</td>`;
            }
            tableElement += '</tr>';
        });

        tableElement += '</table>';

        return tableElement;
    }
