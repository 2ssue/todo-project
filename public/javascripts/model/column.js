import * as views from '../view/views.js';
import * as _ from '../util/utils.js';
import Observable from '../util/observable.js';

export default class Column extends Observable{
    constructor(columns){
        super();
        this.columns = columns;
        this.subscribe(updateColumnName);
        renderColumnList(columns);
    }

    updateColumn(index, name){
        this.columns[index] = name;
        this.notify(index, name);
    }

    notify(index, column){
        this.observers.forEach(observer => observer(index, column));
    }
}

function renderColumnList(columns){
    const boardSection = _.$('#board');

    columns.forEach((element, index) => {
        boardSection.innerHTML += views.columnHTML(element.name, index);
    })
}

function updateColumnName(index, name){
    _.$(`.column:nth-child(${Number(index) + 2}) h3`).innerHTML = name;
}