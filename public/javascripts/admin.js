import Util from './utils.js'

const _ = new Util();
const authElement = 
`<div class='show-right'>
    <select name='auth' id='select-auth'>
        <option value='0'>사용자</option>
        <option value='1'>관리자</option>
    </select>
    <input type='button' value='권한 변경' id='change-auth'>
    <input type='button' value='삭제' id='delete-user'>
</div>`;

class Admin{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('#button-lookup'), 'click', this.getUserData.bind(this));
    }

    getUserData(){
        _.get('/admin/get/users').then(res => {
            res.text().then(res => {
                this.renderUserData(res);
            })
        });
    }

    renderUserData(res){
        const container = _.$('#table-container');
        const header = ['아이디', '이름', '권한'];
        
        container.innerHTML = _.templateJsonToTable(res, header) + authElement;
        
        _.regist(_.$('table'), 'click', function(e){
            this.selectUser(e);
        }.bind(this));

        _.regist(_.$('#change-auth'), 'click', this.changeUserAuth.bind(this));
        _.regist(_.$('#delete-user'), 'click', this.deleteUser.bind(this));     
    }

    selectUser(event){
        const parent = event.target.parentNode;

        if(parent.previousElementSibling){
            const isSelect = parent.className;

            if(isSelect){
                parent.classList.remove('select');
            }else{
                parent.classList.add('select');
            }
        }
    }

    deleteUser(){
        const selectedUser = _.$$('.select');
        if(selectedUser.length > 1){
            alert('유저 삭제는 한명씩만 가능합니다');
            return;
        }

        if(selectedUser.length > 0){
            const userId = selectedUser[0].firstElementChild.innerText;

            _.post('/admin/delete/user', {userId: userId}).then(res => {
                if(res.redirected){
                    alert('유효하지 않은 권한입니다');
                    location.href = res.url;
                }else{
                    res.text().then(res => {
                        if(JSON.parse(res).result === 'fail'){
                            alert('유저 삭제 실패');
                        }else{
                            this.renderUserData(res);
                            alert(`${userId} 유저가 삭제되었습니다`);
                        }
                    });
                }
            })
        }
    }

    changeUserAuth(){
        const selectedUser = _.$$('.select');
        if(selectedUser.length > 0){
            let userlist = [];
            selectedUser.forEach((element) => {
                userlist.push(`'${element.firstElementChild.innerText}'`);
            });
            const auth = _.$('#select-auth').value;
            
            _.post('/admin/change/users/auth', {userlist: userlist, authValue: Number(auth)}).then(res => {
                if(res.redirected){
                    alert('유효하지 않은 권한입니다');
                    location.href = res.url;
                }else{
                    res.text().then(res => {
                        this.renderUserData(res);
                        alert(`${userlist} 권한이 변경되었습니다`);
                    });
                }
            });
        }else{
            alert('선택된 사용자가 없습니다');
        }
    }
}

new Admin();