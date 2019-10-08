import Util from './utils.js'
import * as views from './view/views.js';

const _ = new Util();

class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(document, 'DOMContentLoaded', this.getColumnList.bind(this));
        _.regist(document, 'DOMContentLoaded', this.getCardList.bind(this));
    }

    getColumnList(){
        _.get(`${location.pathname}/columns`).then(res => {
            res.text().then(res => {
                this.columns = JSON.parse(res);
                const boardSection = _.$('#board');
                
                this.columns.forEach((element) => {
                    boardSection.innerHTML += views.columnHTML(element.name);
                });
            });
        });
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