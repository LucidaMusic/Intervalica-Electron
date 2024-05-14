/// <reference path="../global.js" />
/// <reference path="globalDialogs.js" />

// Actualizar la previsualizacion cuando se elige una opcion en el selector de intervalos
HTML_previousIntervalSelect.addEventListener('change', () => {
    // Obtén el valor de la opción seleccionada
    selectedInterval = getIntervalById(getSelectedPreviousInterval());
    HTML_intervalFractionValueSpan.innerHTML = "(" + selectedInterval.stringValue + ")";
    HTML_newFreqSpan.innerHTML = getSelectedPreviousFreq() * selectedInterval.numberValue;
});

HTML_setPreviousIntervalButton.addEventListener("click", () => {
    updateModeCanvas();
})

function getSelectedPreviousInterval() {
    return HTML_previousIntervalSelect.options[HTML_previousIntervalSelect.selectedIndex].getAttribute("data-value");
}
