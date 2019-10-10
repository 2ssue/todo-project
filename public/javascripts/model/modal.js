import * as views from '../view/views.js';
import * as _ from '../util/utils.js';

export function showDeleteCardModal(){
    addModalIntoBody(views.deleteCardModalHTML);
}

function addModalIntoBody(htmlElement){
    const body = _.$('body');

    body.insertAdjacentHTML('beforeend', htmlElement);
    body.classList.add('modal-on');
}

export function removeModal(){
    _.$('.modal').remove();
    _.$('body').classList.remove('modal-on');
}