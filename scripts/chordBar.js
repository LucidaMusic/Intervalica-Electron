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
      PreparePrevFreqCanvas(previousChord, HTML_previousFreqChordView)

      

      showDialog(HTML_previousFreqModal);
    }
  });
