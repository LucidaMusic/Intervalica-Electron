/// <reference path="global.js" />
/// <reference path="./dialog-scripts/globalDialogs.js" />


//Crear nuevo acorde (al final)
HTML_newChordButton
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
      var previousChord = song[song.length - 1];
      HTML_previousChordName.innerHTML = previousChord.name;
      paintLinesOnPrevFreqCanvas(previousChord, HTML_previousFreqChordView)

      //ESTO TIENE QUE SER PARTE DE PAINT LINE ON CAVAS  aparte ahi tendre mas facil el acceso al
      //Hacemos que las barras tengan la funcionalidad de ser seleccionadas y su numero mostrado aparte
      HTML_previousFreqChordView.addEventListener("click", function (event) {
        const chordViewLineContainer = event.target.closest(".chord-view-line-container");
        if (chordViewLineContainer) {
          // Obtener valor de frecuencia
          let noteId = chordViewLineContainer.getAttribute("data-note-id");
          let selectedPreviousNote = null;
          if (previousChord.root.id == noteId) {
            HTML_clickedPreviousFreqSpan.innerHTML = previousChord.root.freq;
          } else {
            //Miramos en modo
            let selectedPreviousNoteInMode = previousChord.modeNotes.find(note => note.id == noteId);
            if (selectedPreviousNoteInMode != undefined) {
              HTML_clickedPreviousFreqSpan.innerHTML = selectedPreviousNoteInMode.freq;
            } else {
              console.error("Algo ta mal supongo");
            }
          }

          //Devuelve el valor blurred al que ya estaba seleccionado (si lo estaba)
          HTML_previousFreqChordView.querySelectorAll(".chord-view-line-container:not(.blurred)")
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
