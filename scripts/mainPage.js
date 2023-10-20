//Limitar 1tonica input a 4 caracteres (Decimales??)
HTML_firstFreqInput
    .addEventListener("input", () => {
        const inputValue = HTML_firstFreqInput.value;
        if (inputValue.length >= 4) {
            HTML_firstFreqInput.value = inputValue.slice(0, 4);
        }
    });


//Crear nuevo acorde
document
    .getElementById("new-chord-button")
    .addEventListener("click", () => {
        //Preparamos el acorde a añadir
        inPreparationChord = new Chord();

        if (song.length == 0) {

            //Ya conozco previous freq y previous interval asi que los establezco
            previousFreq = HTML_firstFreqInput.value
            inPreparationChord.setPreviousInterval(Intervals.UNISON)
            //Abrir popup de duración
            showDialog(HTML_chordDurationModal);

        } else {

            let previousChord = song[song.length - 1];

            HTML_previousChordName.innerHTML = previousChord.name;

            paintLinesOnCanvas(previousChord, HTML_canvasInModal)

            //Hacemos que las barras tengan la funcionalidad de ser seleccionadas y su numero mostrado aparte
            HTML_canvasInModal.addEventListener("click", function (event) {
                const chordViewLineContainer = event.target.closest(".chord-view-line-container");
                if (chordViewLineContainer) {
                    // Obtener valor de frecuencia
                    let noteId = chordViewLineContainer.getAttribute("data-note-id");
                    let selectedPreviousNote = song[song.length - 1].notes.find(note => note.id == noteId);
                    previousFreqDesiredValue = selectedPreviousNote.freq;
                    //const previousFreqDesiredValue = chordViewLineContainer.querySelector(".chord-view-line-number").textContent;

                    // Mostramos el valor clickado
                    HTML_clickedPreviousFreqSpan.innerHTML = previousFreqDesiredValue;

                    //Devuelve el valor blurred al que ya estaba seleccionado (si lo estaba)
                    HTML_canvasInModal.querySelectorAll(".chord-view-line-container:not(.blurred)")
                        .forEach(element => element.classList.add("blurred"));

                    //Dejamos seleccionado el numero que sea
                    chordViewLineContainer.classList.remove("blurred")

                    //Al haber seleccionado un valor, si los botones están disabled, se activan
                    /*           if (HTML_setPreviousFreqButtonQuick.disabled) {
                                HTML_setPreviousFreqButtonQuick.disabled = false;
                              }
                              if (HTML_setPreviousFreqButton.disabled) {
                                HTML_setPreviousFreqButton.disabled = false;
                              }
                     */
                    //Además se esconde el texto de error
                    hideErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
                }
            });

            showDialog(HTML_previousFreqModal);
        }
    });
