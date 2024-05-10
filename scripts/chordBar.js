//Crear nuevo acorde
document
  .getElementById("new-chord-button") //reemplazar por variable
  .addEventListener("click", () => {
    //Preparamos el acorde a añadir
    inPreparationChord = new Chord();

    if (song.length == 0) {
      //Ya conozco previous freq y previous interval asi que los establezco
      previousFreq = HTML_firstFreqInput.value
      inPreparationChord.setPreviousInterval(Intervals.UNISON)
      //Abrir popup de duración
      showDialog(HTML_previousIntervalModal);
    } else {
      //Preparamos el canvas del previous freq
      let previousChord = song[song.length - 1];
      HTML_previousChordName.innerHTML = previousChord.name;
      paintLinesOnPrevFreqCanvas(previousChord, HTML_canvasInModal)

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

          //Además se esconde el texto de error
          hideErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
        }
      });

      showDialog(HTML_previousFreqModal);
    }
  });
