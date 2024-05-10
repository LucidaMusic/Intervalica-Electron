function hideShownDialogs() {
  [HTML_modalBackground,
    HTML_previousFreqModal,
    HTML_previousIntervalModal,
    HTML_chordDurationModal,
    durationErrorText,
    HTML_chordIntervalsModal,
    HTML_octavationModal]
    .forEach(dialog => {
      if (!dialog.classList.contains(CSS_noDisplay)) {
        hideElement(dialog)
      }
    });
}

function showDialog(dialog) {
  showElement(HTML_modalBackground)
  showElement(dialog)
}

//Esto da la funcionalidad a los botones de desplazarse a otra pagina de manera general
//Se supone que si puedo avanzar de pagina es porque los datos estan establecidos.
//Para guardar datos o más funcionalidades se usan eventListeners especñificos para evitar problemas de simetria (ir a una pagina != volver a la misma pagina)
document.querySelectorAll("[data-go-to]")
  .forEach(element => {
    element
      .addEventListener("click", () => {
        hideShownDialogs();
        switch (element.getAttribute("data-go-to")) {
          case "close":
            resetModalValues();
            break;
          case "previous-freq-modal":
            showDialog(HTML_previousFreqModal);
            break;
          case "previous-interval-modal":
            showDialog(HTML_previousIntervalModal);
            break;
          case "chord-duration-modal":
            showDialog(HTML_chordDurationModal);
            break;
          case "chord-intervals-modal":
            showDialog(HTML_chordIntervalsModal);
            break;
          case "octavation-modal":
            showDialog(HTML_octavationModal);
            break;
          case "finish-chord-creation":
        }
      });
  });

function resetModalValues() {
  //Previous Freq
  HTML_clickedPreviousFreqSpan.innerHTML = null;
  HTML_durationInput.value = null;
  showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
  //Previous Interval
  selectedInterval = Intervals.UNISON;
  HTML_previousFreqSelect.selectedIndex = 0;
}

function paintLinesOnPrevFreqCanvas(chord) { 
  let maxFreqValue, minFreqValue; //estos datos los podria tener ya actualizados de cada vez que se crea un acorde. Si las notas recién añadidas son mayores/menores a las que ya se conocia, se actualiza el recuento

  if (relativeToSong) {
    let allNotesFromSong = [].concat(...song);

    maxFreqValue = Math.max(...allNotesFromSong);
    minFreqValue = Math.min(...allNotesFromSong);
  } else {      //Default is relative to chord
    let chordFreqs = chord.notes.map(note => note.freq);

    maxFreqValue = Math.max(...chordFreqs);
    minFreqValue = Math.min(...chordFreqs);
  }

  //Dado que necesito mas espacio
  //Esto se puede calcular teniendo en cuenta el tamaño de las letras
  maxFreqValue *= 1.2;
  minFreqValue *= 0.8;

  //Establecemos valores que sirven para calcular punto y de las lineas en escala logarítmica 
  let minLogFreq = Math.log(minFreqValue) / Math.log(10);
  let logRange = (Math.log(maxFreqValue) / Math.log(10)) - minLogFreq;

  let height = 500; //Height real del canvas o contenedor

  //Para cada nota en el acorde
  for (let i = 0; i < chord.notes.length; i++) {
    //Leemos el objeto de nota
    chordNote = chord.notes[i]

    //Leemos el valor de la frecuencia
    let chordFreq = chordNote.freq;

    //Calculamos posición en Y para la barra y el texto
    let yPosition = (Math.log(chordFreq) / Math.log(10) - minLogFreq) / logRange * height;

    //Dinujamos linea
    let line = document.createElement("div");
    line.classList.add("chord-view-line");

    //Dibujamos numero
    let number = document.createElement("span");
    number.classList.add("chord-view-line-number");
    number.innerHTML = chordFreq;

    //Dibujamos parent
    let lineParent = document.createElement("div");

    lineParent.appendChild(number);
    lineParent.appendChild(line);

    lineParent.style.bottom = yPosition + "px";
    lineParent.classList.add("chord-view-line-container");
    lineParent.classList.add("blurred");

    //Asignamos nota a objeto HTML
    lineParent.setAttribute("data-note-id", chordNote.id)

    HTML_canvasInModal.appendChild(lineParent);
  }
}

function paintLinesOnModesAndExtensionsCanvas(freqs) { 
  let maxFreqValue, minFreqValue; //estos datos los podria tener ya actualizados de cada vez que se crea un acorde. Si las notas recién añadidas son mayores/menores a las que ya se conocia, se actualiza el recuento

  maxFreqValue = Math.max(...freqs);
  minFreqValue = Math.min(...freqs);


  //Dado que necesito mas espacio
  //Esto se puede calcular teniendo en cuenta el tamaño de las letras
  maxFreqValue *= 1.2;
  minFreqValue *= 0.8;

  //Establecemos valores que sirven para calcular punto y de las lineas en escala logarítmica 
  let minLogFreq = Math.log(minFreqValue) / Math.log(10);
  let logRange = (Math.log(maxFreqValue) / Math.log(10)) - minLogFreq;

  let height = 500; //Height real del canvas o contenedor

  //Para cada nota en el acorde
  for (let i = 0; i < freqs.length; i++) {

    //Leemos el valor de la frecuencia
    let chordFreq = freqs[i];

    //Calculamos posición en Y para la barra y el texto
    let yPosition = (Math.log(chordFreq) / Math.log(10) - minLogFreq) / logRange * height;

    //Dinujamos linea
    let line = document.createElement("div");
    line.classList.add("chord-view-line");

    //Dibujamos numero
    let number = document.createElement("span");
    number.classList.add("chord-view-line-number");
    number.innerHTML = chordFreq;

    //Dibujamos parent
    let lineParent = document.createElement("div");

    lineParent.appendChild(number);
    lineParent.appendChild(line);

    lineParent.style.bottom = yPosition + "px";
    lineParent.classList.add("chord-view-line-container");

    HTML_canvasMode.appendChild(lineParent);
  }
}