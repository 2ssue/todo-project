import * as views from '../view/views.js';
import * as _ from '../util/utils.js';
import Observable from '../util/observable.js';

export default class Card extends Observable{
    constructor(cards){
        super();
        this.cards = redestructureCardsData(cards);
        renderAllCardList(this.cards);

        this.subscribe(updateCardCount);
        this.notify();
    }

    showAddCardInterface(base){
        _.$('.cards', base).insertAdjacentHTML('afterbegin', views.addCardHTML());
    }

    unshowAddCardInterface(){
        const addCardInterface = _.$('.add-card');

        if(addCardInterface){
            const column =  addCardInterface.parentNode.parentNode;
            addCardInterface.remove();
            return column;
        }
    }

    updateCardData(cards, reRenderFlag){
        this.cards = redestructureCardsData(cards);
        this.notify();
        
        if(reRenderFlag){
            renderAllCardList(this.cards);
        }
    }

    notify(){
        this.observers.forEach(observer => observer(this.cards));
    }
}

function redestructureCardsData(data){
    return data.reduce((acc, cur) => {
        const columnIndex = Number(cur.column_id.split('').pop());
        if(!acc[columnIndex]) acc[columnIndex] = [];
        acc[columnIndex].push(cur);
        
        return acc;
    }, []);
}

function renderAllCardList(data){
    _.$$('.cards').forEach((element, index) => {
        if(data[index]){
            element.innerHTML = data[index].reduce((acc, cur) => acc + views.cardHTML(cur.card_id, cur.content), '');
        }
    });
}

function updateCardCount(data){
    _.$$('.card-count').forEach((element, index) => {
        if(data[index])
            element.innerHTML = data[index].length;
        else
            element.innerHTML = 0;
    })
}