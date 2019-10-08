export function columnHTML(name, index){
    const renderHTML = 
    `<section class='column' id='column-${index}'>
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
        <textarea></textarea>
        <button id='add-button' disabled>Add</button>
        <button id='cancel-button'>Cancel</button>
    </div>`;
    
    return renderHTML;
}

export function cardHTML(id, content){
    const renderHTML = 
    `<div class='card' id='card-${id}'>
        <span id='close-card-button' class='button'>&#215;</span>
        <p>📄 ${content}</p>
    </div>`;

    return renderHTML;
}