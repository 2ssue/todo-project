import Util from './utils.js';

const _ = new Util();

class SignIn{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('button'), 'click', this.signInUser);
    }
    
    signInUser(){
        let userInput = {
            userid: _.$('#userid').value,
            password: _.$('#password').value,
            name: _.$('#name').value
        }
        _.post('/signin', userInput).then(res => {
            res.json().then(res => {
                if(res.result === 'success'){
                    alert('회원가입이 완료되었습니다');
                    location.href = '/';
                }else{
                    alert('회원가입에 실패했습니다. 다시 확인해주세요');
                }
            })
        });
    }
}

new SignIn();