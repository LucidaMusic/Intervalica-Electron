/// <reference path="../global.js" />
/// <reference path="globalDialogs.js" />
/// <reference path="../../indexRender.js" />
/// <reference path="previousIntervalDialog.js" />
/// <reference path="previousFreqDialog.js" />
/// <reference path="modeAndExtensionsDialog.js" />
/// <reference path="octavationDialog.js" />
/// <reference path="../../objects/Note.js" />
/// <reference path="../../objects/Chord.js" />

const HTML_chordDurationModal = document.getElementById("chord-duration-modal");
const HTML_durationInput = document.getElementById("chord-duration-input");
const HTML_durationUl = document.getElementById("duration-ul");
const durationErrorText = document.getElementById("duration-error-text");

let HTML_setDurationButton = document.getElementById("set-duration-button");

//Cada figura musical. al clicarle, rellenará el campo con la duración asociada
HTML_durationUl.querySelectorAll("figure")
  .forEach(figure => {
    figure
      .addEventListener("click", () => {
        unselectElement(HTML_durationUl.querySelector("figure." + CSS_selected))
        selectElement(figure)
        HTML_durationInput.value = figure.getAttribute("data-value");
        HTML_setDurationButton.focus(); //para que al pulsar enter se active el boton
      });
  });

//Finalizar proceso de creacion de acorde (añadir al final un acorde que no es el primero de la cancion)
HTML_setDurationButton
  .addEventListener("click", () => {
    //Opciones
    if (song.length == 0) {
      //Añadir el primer acorde de una cancion
      console.error("bro cancion esta vacio? esto no ta hecho")
    } else {
      addNextChordAt(-1); //De momento siempre añadimos al final
    }
    //Añadir acorde no al final
    //seria igual que at the end pero cambia el push del song
    //Al darle al boton correcto, se abre el dialogo para conseguir esto. (hay que hacer que los botones de siguiente y tal vayan acordes. Podemos )
    //Se debera pedir la nueva referncia del acorde que va despues
    //Añadir acorde al final
  });

function paintLinesOnChordView(chord, canvas) {
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

    //Asignamos nota a objeto HTML
    lineParent.setAttribute("data-note-id", chordNote.id)

    canvas.appendChild(lineParent);
  }
}

function getSelectedDurationValue() {
  return HTML_durationInput.value;
}

function addNextChordAt(index) {
  //Construimos el acorde a partir de los datos seleccionados por el usuario
  let newChord = new Chord();
  newChord.name = "Nombre opcional";
  newChord.duration = getSelectedDurationValue();
  newChord.mode = findModeById(getSelectedModeValue());
  newChord.previousInterval = getIntervalById(getSelectedPreviousInterval());
  //newChord.previousReferenceNoteId = 

  //Añadimos las notas al acorde creado
  //tonica
  var previousChord = song[song.length - 1];
  var newChordRootFreq = previousChord.root.freq * previousInterval.numberValue;
  newChord.addRootNote(new Note(previousInterval, 0, newChordRootFreq));

  //Modo
  newChord.mode.intervals.forEach((interval) => {
    var newChordModeFreq = newChordRootFreq * interval.numberValue
    newChord.addModeNote(new Note(interval, 0, newChordModeFreq));
  });


  //Crear el objeto del acorde e insertarlo en la barra de acordes
  //Crear chordBox
  var HTML_chordBox = document.createElement("div");
  HTML_chordBox.classList.add("chord-box");

  //Previous freq


  //Previous interval

  //Modo
  var HTML_chordBoxMode = document.createElement("span");
  HTML_chordBoxMode.innerHTML = "Modo: " + findModeById(getSelectedModeValue()).name + " <br>";

  //Duration
  var HTML_chordBoxDuration = document.createElement("span");
  HTML_chordBoxDuration.innerHTML = "Duracion: " + getSelectedDurationValue() + " <br>";

  //Chord view
  var HTML_chordView = document.createElement("div");
  HTML_chordView.classList.add("chord-view");
  HTML_chordView.style.width = "300px"
  HTML_chordView.style.height = "500px"
  HTML_chordView.style.position = "relative"
  paintLinesOnChordView(newChord, HTML_chordView);

  //Empaquetacion de objetos
  HTML_chordBox.append(HTML_chordBoxMode,
    HTML_chordBoxDuration,
    HTML_chordView
  );

  //Inserción final
  if (index != -1) {
    HTML_chordBar.insertBefore(HTML_chordBox, HTML_chordBar.children[index]);
    song.splice(index, 0, newChord);
  } else { //El acorde va al final
    HTML_chordBar.appendChild(HTML_chordBox); //dado que el ultimo elemento es el boton de añadir acorde (seria mejor que ese boton este fuera de chordBar, no es un acorde...)
    song.push(newChord);
  }
}
