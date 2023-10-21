

// Actualizar la previsualizacion cuando se elige una opcion en el selector de intervalos
HTML_previousFreqSelect.addEventListener('change', () => {
    // Obtén el valor de la opción seleccionada
    selectedInterval = getIntervalById(HTML_previousFreqSelect.options[HTML_previousFreqSelect.selectedIndex].getAttribute("data-value"));

    HTML_intervalFractionValueSpan.innerHTML = "(" + selectedInterval.stringValue + ")";

    HTML_newFreqSpan.innerHTML = userSelectedPreviousFreqValue * selectedInterval.numberValue;
});

HTML_setPreviousIntervalButton.addEventListener("click", () => {

    //Reiniciar canvas mode
[...HTML_canvasMode.children]
.forEach(child => {
    HTML_canvasMode.removeChild(child);
});

    rootFreq = userSelectedPreviousFreqValue * selectedInterval.numberValue;

let frecuencias = [rootFreq]
//cogemos modo seleccionado
let selectedModeId= ?
let selectedMode = findModeByid(selectedModeId)
//cogemos sus intervalos
let modeFreqs=selectedMode.intervals.map(interval=>interval*rootFreq)
//a cada uno le cogemos su numberValue y lo multiplicamos por la rootFreq

//Omitimos extensiones por ahora 
let extensionsFreqs=[]

    //Pintamos las frecuencias en el canvas paintLinesOnCanvasModes([rootFreq, ...modeFreqs, ...extensionsFreqs], HTML_canvasMode)
})
