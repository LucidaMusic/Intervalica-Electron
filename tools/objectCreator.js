module.exports = {
    createNoteObject: (freq) => {
        //creo div global
        const div = document.createElement("div");
        //creo h3 con frecuencia
        const h3 = document.createElement("h3");
        h3.innerHTML = freq;
        h3.setAttribute("onclick", "playNewSound(" + freq + ")");
        h3.style.cursor="pointer";
        //Creamos botones de edicion en su div
        let divEditionControls=document.createElement("div")
        let buttonClose=document.createElement("button")
        buttonClose.innerText="X"
        buttonClose.setAttribute("onclick", "deleteChordBox()")
        let buttonMoveLeft=document.createElement("button")
        buttonMoveLeft.innerText="<-"
        let buttonMoveRight=document.createElement("button")
        buttonMoveRight.innerText="->"
        divEditionControls.appendChild(buttonMoveLeft);
        divEditionControls.appendChild(buttonMoveRight);
        divEditionControls.appendChild(buttonClose);
        //h3 dentro de div
        //Controles de edicion dentro de div
        div.appendChild(divEditionControls);
        div.appendChild(h3);
        //div es clase "chordBox"
        div.setAttribute("class", "chordBox");
        //Incluimos llamada a playsound como onclick
        
        return div;
    }
}