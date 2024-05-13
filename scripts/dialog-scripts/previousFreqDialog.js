/// <reference path="../global.js" />
/// <reference path="globalDialogs.js" />


//Preparo modal de prev interval al pulsar continuar
//Optimizacion: si no ha cambiado el prevFreq no hace falta recargar esta pagina. Seria planteable que sea al seleccionar la nota cuando se actualicen estos valores
[HTML_setPreviousFreqButton,
    HTML_setPreviousFreqButtonQuick]
    .forEach(element => {
        element.addEventListener("click", () => {
            HTML_previousFreqSpan.innerHTML = getSelectedPreviousFreq();
            HTML_newFreqSpan.innerHTML = getSelectedPreviousFreq() * getIntervalById(getSelectedPreviousInterval()).numberValue;
        });
    })

    function getSelectedPreviousNoteId(){
        return HTML_previousFreqChordView.querySelector(".chord-view-line-container:not(.blurred)").getAttribute("data-note-id");
    }  
    
    function getSelectedPreviousFreq(){
        return HTML_previousFreqPreviewSpan.innerHTML;
    }