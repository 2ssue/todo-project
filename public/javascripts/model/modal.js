import * as views from '../view/views.js';
import * as _ from '../util/utils.js';

export function showDeleteCardModal(){
    addModalIntoBody(views.deleteCardModalHTML);
}

export function showEditCardModal(content){
    addModalIntoBody(views.editCardModalHTML(content));
}

export function showEditColumnModal(content){
    addModalIntoBody(views.editColumnModalHTML(content));
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