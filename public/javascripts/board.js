import * as _ from './util/utils.js';
import * as views from './view/views.js';


class Board{
    constructor(){
        this.registEvent();
    }

    registEvent(){
        _.regist(_.$('#board'), 'click', this.boardEventController.bind(this));
        _.regist(_.$('#board'), 'keyup', this.activateButton);
        _.regist(document, 'DOMContentLoaded', this.getColumnList.bind(this));
        _.regist(document, 'DOMContentLoaded', this.getCardList.bind(this));
        _.regist(_.$('#board'), 'dragstart', this.setDragElement.bind(this));
        _.regist(_.$('#board'), 'dragend', this.dropElement);
        _.regist(_.$('#board'), 'dragenter', this.checkDropPosition.bind(this));
    }

    boardEventController(e){
        if(e.target.id === '') return;
        this.removeAddCardInterface();
        
        switch(e.target.id){
            case 'add-card-button':
                _.$('.cards', e.target.parentNode).insertAdjacentHTML('afterbegin', views.addCardHTML());
                break;
            case 'add-button':
                this.addCard(e.target.previousElementSibling.value);
                break;
            case 'cancel-button':
                this.removeAddCardInterface();
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
            res.json().then(res => {
                this.columns = res;
                const boardSection = _.$('#board');
                
                this.columns.forEach((element, index) => {
                    boardSection.innerHTML += views.columnHTML(element.name, index);
                });
            });
        });
    }
    
    getCardList(){
        _.get(`${location.pathname}/cards`).then(res => {
            res.json().then(res => {
                this.cards = res;
                this.renderCardList();
            })
        })
    }

    renderCardList(){
        let cardsHTML = [];
        this.cards.forEach(element => {
            const columnIndex = Number(element.column_id.split('').pop());
            if(!cardsHTML[columnIndex])
                cardsHTML[columnIndex] = [];
            cardsHTML[columnIndex].push(views.cardHTML(element['card_id'], element.content)); 
        });

        _.$$('.cards').forEach((element, index) => {
            element.innerHTML = cardsHTML[index] ? cardsHTML[index].join('') : '';
            element.parentElement.firstElementChild.innerHTML = cardsHTML[index] ? cardsHTML[index].length : 0;
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
                    this.removeAddCardInterface();
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