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
        _.regist(_.$('#board'), 'dragend', this.dropElement);
        _.regist(_.$('#board'), 'dragenter', this.checkDropPosition.bind(this));
    }

    boardClickEventController(e){
        if(e.target.id === '') return;
        this.removeAddCardInterface();
        
        switch(e.target.id){
            case 'add-card-button':
                this.cardModel.showAddCardInterface(e.target.parentNode);
                break;
            case 'add-button':
                this.addCard(e.target.previousElementSibling.value);
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
        this.dragged = e.target;
        e.target.classList.add('while-drag');
        e.dataTransfer.dropEffect = 'move';
    }

    dropElement(e){
        e.target.classList.remove('while-drag');
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

    removeAddCardInterface(){
        const addCardInterface = _.$('.add-card');

        if(addCardInterface)
            addCardInterface.remove();
    }

    addCard(content){
        _.post(`${location.pathname}/add/card`, {content: content}).then(res => {
            res.json().then(res => {
                const result = res;
                if(result.result === 'success'){
                    this.getCardList();
                    alert('추가가 완료되었습니다');
                }else{
                    alert('추가 실패. 다시 시도해주세요');
                }
            })
        })
    }

    updateCard(){ //Observer, 카드가 변경될 때 업데이트 신호 
        _.post(`/board/update/card/${cardNum}`, cardContent).then(res => {
            
        });
    }
}

new Board();