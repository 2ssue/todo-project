import * as _ from './util/utils.js';
import * as views from './view/views.js';
import Card from './card.js';
import Column from './column.js';

class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('#board'), 'click', this.boardClickEventController.bind(this));
        _.regist(_.$('#board'), 'keyup', this.activateButton);
        _.regist(document, 'DOMContentLoaded', this.getColumnList.bind(this));
        _.regist(document, 'DOMContentLoaded', this.getCardList.bind(this));
        _.regist(_.$('#board'), 'dragstart', this.setDragElement.bind(this));
        _.regist(_.$('#board'), 'dragend', this.dropElement.bind(this));
        _.regist(_.$('#board'), 'dragenter', this.checkDropPosition.bind(this));
    }

    boardClickEventController(e){
        if(e.target.id === '') return;
        const column = this.cardModel.unshowAddCardInterface();
        
        switch(e.target.id){
            case 'add-card-button':
                this.cardModel.showAddCardInterface(e.target.parentNode);
                break;
            case 'add-button':
                this.addCard(e.target, column);
                break;
            case 'cancel-button':
                this.cardModel.unshowAddCardInterface();
                break;
        }
    }

    checkDropPosition(e){
        if(e.target.className === 'cards'){
            const adjacentElement = document.elementFromPoint(e.clientX, e.clientY-8);
            if(adjacentElement.className === 'cards'){
                e.target.insertAdjacentElement('beforeend', this.dragged);
                return;
            }
        }
        
        if(e.target.className === 'card'){
            if(e.target.previousElementSibling){
                e.target.insertAdjacentElement('afterend', this.dragged);
            }else{
                e.target.insertAdjacentElement('beforebegin', this.dragged);
            }
        }
    }

    setDragElement(e){
        this.dragStartColumn = _.$(`#${e.target.parentNode.parentNode.id} h3`).innerHTML;
        this.dragged = e.target;
        e.target.classList.add('while-drag');
        e.dataTransfer.dropEffect = 'move';
    }

    dropElement(e){
        e.target.classList.remove('while-drag');
        this.updateCardState(e.target);
    }

    getColumnList(){
        _.get(`${location.pathname}/columns`).then(res => {
            res.json().then(res => this.columnModel = new Column(res));
        });
    }
    
    getCardList(reRenderCardflag){
        _.get(`${location.pathname}/cards`).then(res => {
            res.json().then(res => {
                if(this.cardModel){
                    this.cardModel.updateCardData(res, reRenderCardflag);
                }else{
                    this.cardModel = new Card(res);
                }
            });
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

    addCard(element, column){
        const content = element.previousElementSibling.value;
        const columnName = _.$('h3', column).innerHTML;
        const columnIndex = column.id.split('-').pop();

        _.post(`${location.pathname}/add/card`, {content, columnIndex, columnName}).then(res => {
            res.json().then(res => {
                const result = res;
                if(result.result === 'success'){
                    this.getCardList('add');
                    alert('추가가 완료되었습니다');
                }else{
                    alert('추가 실패. 다시 시도해주세요');
                }
            })
        })
    }

    updateCardState(card){
        const cardInformation = {
            content: _.$(`#content`, card).innerHTML,
            moveColumnIndex: card.parentNode.parentNode.id.split('-').pop(),
            moveState: _.$(`#${card.parentNode.parentNode.id} h3`).innerHTML,
            prevCard: card.previousElementSibling ? card.previousElementSibling.id.split('').pop() : 'NULL',
            prevState: this.dragStartColumn
        };

        const cardNum = card.id.split('-').pop();

        _.post(`${location.pathname}/update/card/state/${cardNum}`, cardInformation).then(res => {
            res.json().then(res => {
                if(res.result !== 'success'){
                    alert('동기화 실패. 다시 시도해주세요');    
                }
                this.getCardList();
            })
        });
    }
}

new Board();