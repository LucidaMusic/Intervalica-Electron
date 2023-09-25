const { createNoteObject } = require('./tools/objectCreator.js');
const { playExistingSound, generateAudioArrayFromNote } = require("./tools/soundMotor.js")

const ipcRenderer = require("electron").ipcRenderer;

const chordDuration = null;


/* let Chord = class {
  constructor(alto, ancho) {
    //Intervalo respecto acorde anterior
    intervalPreviousTonic
    //Lista de intervalos aplicados


    this.alto = alto;
    this.ancho = ancho;
  }
}; */
/* 
var inPreparationChord = new Chord */

/* ipcRenderer.on("nuevoAcorde", (event, freq) => {
  //Crear elemento grafico e insertarlo
  const chordBox = createNoteObject(freq);
  document.querySelector("#chordBar").insertBefore(chordBox, document.querySelector("#newChordButton"))
  //Generar audio y guardarlo (Mas que nada para la reproduccion individual de acorde)
  ipcRenderer.send("saveThisArray", generateAudioArrayFromNote(freq));
}); */

/* ipcRenderer.on("recibirTono", (event, data) => {
  playSound(data, 44100);
}); */


ipcRenderer.on("receiveChordDuration", (event, duration) => {
  this.chordDuration = duration;
  console.log(this.chordDuration);
})

const updateFirstTonicFreq = () => {
  //Comprobamos validación de freq de primera tónica (la de BPM no es necesaria a la hora de añadir el acorde)
  let firstTonicFreqValue = document.getElementById("firstRootFreqInput").value
  if (!firstTonicFreqValue) {  //Que no esté vacío
    document.getElementById("firstTonicFreqInputErrorMessage").style.display = "block";
    return;
  }

  document.getElementById("firstTonicFreqInputErrorMessage").style.display = "none";
  //Si es válido, recargamos los chordBox
  //TODO
}

/* const generarTono = () => {
  let freq = document.querySelector("#firstRootFreqInput").value
  const chordBox = createNoteObject(freq);
  document.querySelector("#chordBar").insertBefore(chordBox, document.querySelector("#newChordButton"))

  ipcRenderer.send("generarTono", freq);
}; */

/* const createOrUpdateFirstTone = () => {
  //TODO ESTO TIENE QUE ESTAR EN nuevoAcorde
  if (document.querySelector("#chordBar").childElementCount == 1) {
    //Quiere decir que no hay un tono como tal porque el único elemento que hay es el de añadir tono

    //
  } else if (document.querySelector("#chordBar").childElementCount > 1) {
    //Ya existe un primer tono
  } else {
    console.log("What")
  }
}
 */
const playNewSound = (freq) => {
  return playExistingSound(generateAudioArrayFromNote(freq), 44100)
}


const deleteChordBox = () => {

}



//Interacciones sencillas de front
document
  .getElementById("songControlsPanel__rythm")
  .addEventListener("click", function () {
    document.getElementById("bpmInput").focus();
  });

document
  .getElementById("newChordButton")
  .addEventListener("click", () => {
    ipcRenderer.send("openRequestNoteCreationWindow")
  });

document
  .getElementById("closeModalWindow")
  .addEventListener("click", () => {
    document.getElementById("modalWindow").style.display="none";
  });
document
  .getElementById("modalWindow")
  .addEventListener("click", () => {
    document.getElementById("modalWindow").style.display="none";
  });



