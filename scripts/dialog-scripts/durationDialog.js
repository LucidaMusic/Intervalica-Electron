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
      //addNextChordAt(index);
    } else {
      addNextChordAt(-1); //De momento siempre añadimos al final
    }
    //Añadir acorde no al final
    //seria igual que at the end pero cambia el push del song
    //Al darle al boton correcto, se abre el dialogo para conseguir esto. (hay que hacer que los botones de siguiente y tal vayan acordes. Podemos )
    //Se debera pedir la nueva referncia del acorde que va despues
    //Añadir acorde al final
  });

function getSelectedDurationValue() {
  return HTML_durationInput.value;
}

function addNextChordAt(index) {
  //Construimos el acorde a partir de los datos seleccionados por el usuario
  let newChord = modeAndExtensionsProvisionalChord;
  newChord.name = "Nombre opcional";
  newChord.duration = getSelectedDurationValue();
  newChord.mode = findModeById(getSelectedModeValue());
  newChord.previousInterval = getIntervalById(getSelectedPreviousInterval());
  //newChord.previousReferenceNoteId = 

  //Añadimos las notas al acorde creado
/*   //tonica
  var previousChord = song[song.length - 1];
  var newChordRootFreq = previousChord.root.freq * previousInterval.numberValue;
  newChord.addRootNote(new Note(previousInterval, 0, newChordRootFreq));

  //Modo
  newChord.mode.intervals.forEach((interval) => {
    var newChordModeFreq = newChordRootFreq * interval.numberValue
    newChord.addModeNote(new Note(interval, 0, newChordModeFreq));
  }); */


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

  song.push(newChord); //Para que se tenga en cuenta en la visualziacion se añade antes de pintar lineas

  paintGenericLinesOnCanvas(newChord, HTML_chordView, true);

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
    HTML_chordBar.appendChild(HTML_chordBox);
    //song.push(newChord);
  }
}
