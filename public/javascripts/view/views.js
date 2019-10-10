export function columnHTML(name, index){
    const renderHTML = 
    `<section class='column' id='column-${index}'>
        <span class='card-count'></span>
        <h3>${name}</h3>
        <span class='button'>&#215;</span>
        <span class='button' id='add-card-button'>&#43;</span>
        <section class='cards'></section>
    </section>`
    
    return renderHTML;
}

export function addCardHTML(){
    const renderHTML =  
    `<div class='add-card'>
        <textarea maxlength='500' placeholder='Enter a note'></textarea>
        <button id='add-button' disabled>Add</button>
        <button id='cancel-button'>Cancel</button>
    </div>`;
    
    return renderHTML;
}

export function cardHTML(id, content){
    const renderHTML = 
    `<div class='card' id='card-${id}' draggable='true'>
        <span id='delete-card-button' class='button'>&#215;</span>
        <p>
            <span>📄</span>
            <span id='content'>${content}</span>
        </p>
    </div>`;

    return renderHTML;
}

export const deleteCardModalHTML = 
`<div class='modal'>
    <div class='modal-content'>
        <p>선택한 카드를 삭제하시겠습니까?</p>
        <div class='show-right'>
            <button class='positive-button' id='delete-card'>Delete</button>
            <button>Cancel</button>
        </div>
    </div>
</div>`;