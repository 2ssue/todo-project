import * as _ from './util/utils.js';
import * as views from './view/views.js'
import Card from './model/card.js';
import Column from './model/column.js';
import * as modal from './model/modal.js';

class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('#menu'), 'click', this.showBoardLog);
        _.regist(_.$('#board'), 'click', this.boardClickEventController.bind(this));
        _.regist(_.$('#board'), 'dblclick', this.boardDoubleClickEventController.bind(this));
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
            case 'delete-card-button':
                modal.showDeleteCardModal();
                _.regist(_.$('.modal'), 'click', this.modalEventController.bind(this));
                this.selected = e.target.parentNode;
                break;
            case 'newlog-button':
                this.showBoardLog(e);
                break;
        }
    }

    modalEventController(e){
        if(e.target.localName !== 'textarea' && e.target.className !== 'positive-button'){
            modal.removeModal();
            return;
        }

        switch(e.target.id){
            case 'delete-card':
                this.deleteCard();
                break;
            case 'edit-card':
                this.updateCardContent(e.target);
                break;
        }
    }

    deleteCard(){
        const cardId = this.selected.id.split('-').pop();

        _.post(`${location.pathname}/delete/card/${cardId}`, {
            content: _.$(`#content`, this.selected).innerHTML
        }).then(res => {
            res.json().then(res => {
                if(res.result === 'success'){
                    this.getCardList('delete');
                    modal.removeModal();
                }else{
                    alert('삭제에 실패했습니다. 다시 시도해주세요');
                }
            })
        });
    }

    boardDoubleClickEventController(e){
        switch(e.target.className){
            case 'column-title':
                break;
            case 'card':
                modal.showEditCardModal(_.$(`#content`, e.target).innerHTML);
                _.regist(_.$('.modal'), 'keyup', this.activateButton);
                _.regist(_.$('.modal'), 'click', this.modalEventController.bind(this));
                this.selected = e.target;
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
                _.$('.logs').insertAdjacentHTML('beforebegin', `<p id='newlog-button'>View new activity</p>`);
            });
        })
    }

    activateButton(e){
        if(e.target.value){
            e.target.nextElementSibling.disabled = false;
            e.target.nextElementSibling.classList.add('positive-button');
        }else{
            e.target.nextElementSibling.disabled = true;
            e.target.nextElementSibling.classList.remove('positive-button');
        }
    }

    addCard(element, column){
        const content = element.previousElementSibling.value;
        const columnName = _.$('h3', column).innerHTML;
        const columnIndex = column.id.split('-').pop();

        _.post(`${location.pathname}/add/card`, {content, columnIndex, columnName}).then(res => {
            res.json().then(res => {
                if(res.result === 'success'){
                    this.getCardList('add');
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
            res.json().then(this.getCardList())
        });
    }

    updateCardContent(target){
        const cardNum = this.selected.id.split('-').pop();

        _.post(`${location.pathname}/update/card/${cardNum}`, {content: _.$('textarea', target.parentNode).value}).then(res => {
            res.json().then(() => {
                this.getCardList('update');
                modal.removeModal();
            });
        })
    }

    showBoardLog(e){
        const menu = _.$('.menu');

        if(e.target.id !== 'newlog-button' && menu.classList.contains('show')){
            menu.classList.remove('show');
            return;
        }

        let button;
        if(button = _.$('#newlog-button', menu))
            button.remove();

        menu.classList.add('show');
        _.get(`${location.pathname}/log`).then(res => {
            res.json().then(res => {
                const logContainer = _.$('.logs');
                res.forEach(element => {
                    logContainer.insertAdjacentHTML('afterbegin', views.log(element));
                })
            })
        })
    }
}

new Board();