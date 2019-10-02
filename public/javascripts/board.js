import Util from './utils.js'

const _ = new Util();

class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(document, 'DOMContentLoaded', this.getCardList);
    }

    getCardList(){
        const userName = _.$('header span').innerText;
        _.get(`/board/get/cards/${userName}`).then(res => {
            console.log(res);
        })
    }
}

new Board();