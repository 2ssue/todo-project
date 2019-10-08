export function columnHTML(name){
    const renderHTML = 
    `<section class='column'>
        <h3>${name}</h3>
        <span class='button'>&#215;</span>
        <span class='button' id='add-card-button'>&#43;</span>
        <section class='cards'></section>
    </section>`
    
    return renderHTML;
}