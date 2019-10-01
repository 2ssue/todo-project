import Util from './utils.js';

const _ = new Util();

class Login{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('button'), 'click', this.sendLoginInformation);
        _.regist(_.$('#password'), 'keyup', (e) => {
            if(e.key === 'Enter' && e.target.value !== ''){
                this.sendLoginInformation();
            }
        });
    }

    sendLoginInformation(){
        const body = {
            userid: _.$('#userid').value,
            password: _.$('#password').value
        }

        _.post('/login', body).then((res) => {
            const parseUrl = res.url.split('/');

            if(parseUrl.pop() === 'login'){
                alert('비밀번호나 아이디를 다시 확인해주세요');
            }

            location.href = res.url;
        });
    }
}

new Login();