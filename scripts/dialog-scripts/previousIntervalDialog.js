

// Actualizar la previsualizacion cuando se elige una opcion en el selector de intervalos
HTML_previousFreqSelect.addEventListener('change', () => {
    // Obtén el valor de la opción seleccionada
    selectedInterval = getIntervalById(HTML_previousFreqSelect.options[HTML_previousFreqSelect.selectedIndex].getAttribute("data-value"));

    HTML_intervalFractionValueSpan.innerHTML = "(" + selectedInterval.stringValue + ")";

    HTML_newFreqSpan.innerHTML = userSelectedPreviousFreqValue * selectedInterval.numberValue;
});

HTML_setPreviousIntervalButton.addEventListener("click", () => {
    rootFreq = userSelectedPreviousFreqValue * selectedInterval.numberValue;
    //Reiniciar canvas

    const context = HTML_canvasMode.getContext("2d");

    // Limpia el contenido del canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Pintamos el root freq en el canvas
    paintLinesOnCanvasModes([rootFreq], HTML_canvasMode)
})
