import Util from './utils.js'

const _ = new Util();

class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(document, 'DOMContentLoaded', this.getCardList.bind(this));
    }

    getCardList(){
        _.get(`${location.pathname}/data`).then(res => {
            res.text().then(res => {
                this.cardList = JSON.parse(res);
                console.log(this.cardList);
            })
        })
    }
}

new Board();