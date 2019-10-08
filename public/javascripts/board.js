import Util from './utils.js'
import * as views from './view/views.js';

const _ = new Util();

class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('#board'), 'click', this.columnEventHandler.bind(this));
        _.regist(_.$('#board'), 'keyup', this.activateButton);
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
        _.get(`${location.pathname}/cards`).then(res => {
            res.text().then(res => {
                this.cards = JSON.parse(res);
                console.log(this.cards);
            })
        })
    }

    activateButton(e){
        if(e.target.value){
            e.target.nextElementSibling.disabled = false;
            e.target.nextElementSibling.classList.add('add-button');
        }else{
            e.target.nextElementSibling.disabled = true;
            e.target.nextElementSibling.classList.remove('add-button');
        }
    }

    removeAddCardInterface(){
        const addCardInterface = _.$('.add-card');

        if(addCardInterface)
            addCardInterface.remove();
    }

    columnEventHandler(e){
        switch(e.target.id){
            case 'add-card-button':
                this.removeAddCardInterface();

                const parent = e.target.parentNode;
                _.$('.cards', parent).insertAdjacentHTML('afterbegin', views.addCardHTML());

                break;
            case 'add-button':
                this.addCard(e.target.previousElementSibling.value);
                break;
            case 'cancel-button':
                this.removeAddCardInterface();
                break;
        }
    }

    addCard(content){
        _.post(`${location.pathname}/add/card`, {content: content}).then(res => {
            res.text().then(res => {
                this.cardList = JSON.parse(res);
                console.log(this.cardList);
            })
        })
    }
}

new Board();