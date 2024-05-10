//const ipcRenderer = require("electron").ipcRenderer;

const Chord = require("./objects/Chord.js");
const Note = require("./objects/Note.js");
const { getIntervalById, Intervals } = require("./objects/Intervals.js");
const { findModeById, Modes } = require("./objects/Modes.js");

//Variables configuración usuario
let relativeToSong = false; //a la hora de dibujar las líneas del canvas. Por defecto se hace relativo al acorde

const MAXIMUM_FREQ_POSSIBLE = 8000;
const MINIMUM_FREQ_POSSIBLE = 20;

const CSS_noDisplay = "no-display"; //Clase css para esconder elemento
const CSS_selected = "selected"; //Clase css para seleccionar elemento

//Variables para que tengan alcance global 
const song = new Array();

let inPreparationChord;
let userSelectedPreviousFreqValue;
let selectedInterval = Intervals.UNISON;
let rootFreq;
let noModes = false;

let noteId = 0;
function createNoteId() {
  noteId += 1;
  return noteId;
}

//Temporalmente necesito que haya un acorde ya creado
let testingAlreadyCreatedChord = new Chord();
testingAlreadyCreatedChord.name = "Napolitano sobre C";
testingAlreadyCreatedChord.duration = 1;
testingAlreadyCreatedChord.mode = findModeById("m");
testingAlreadyCreatedChord.previousInterval = getIntervalById("2m");
let noteA = new Note(createNoteId(), 330, getIntervalById("5P").numberValue * (Math.pow(2, -1)), false, false)
let noteB = new Note(createNoteId(), 440, getIntervalById("5P").numberValue * (Math.pow(2, -1)), false, false)
let noteC = new Note(createNoteId(), 550, getIntervalById("5P").numberValue * (Math.pow(2, -1)), false, false)
let noteD = new Note(createNoteId(), 660, getIntervalById("5P").numberValue * (Math.pow(2, -1)), false, false)
let noteE = new Note(createNoteId(), 880, getIntervalById("5P").numberValue * (Math.pow(2, -1)), false, false)
testingAlreadyCreatedChord.addNote(noteA);
testingAlreadyCreatedChord.addNote(noteB);
testingAlreadyCreatedChord.addNote(noteC);
testingAlreadyCreatedChord.addNote(noteD);
testingAlreadyCreatedChord.addNote(noteE);

song.push(testingAlreadyCreatedChord);


//Ejemplo de obtener valores de intervalos
//console.log(findIntervalByName("Tercera menor").getstringValue());
// Ejemplo de uso


/* for (var i = min; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
} */





/* ipcRenderer.on("nuevoAcorde", (event, freq) => {
  //Crear elemento grafico e insertarlo
  const chordBox = createNoteObject(freq);
  document.querySelector("#chordBar").insertBefore(chordBox, document.querySelector("#newChordButton"))
  //Generar audio y guardarlo (Mas que nada para la reproduccion individual de acorde)
  ipcRenderer.send("saveThisArray", generateAudioArrayFromNote(freq));
}); */

/* const updateFirstTonicFreq = () => {
  //Comprobamos validación de freq de primera tónica (la de BPM no es necesaria a la hora de añadir el acorde)
  let firstTonicFreqValue = document.getElementById("firstRootFreqInput").value
  if (!firstTonicFreqValue) {  //Que no esté vacío
    document.getElementById("firstTonicFreqInputErrorMessage").style.display = "block";
    return;
  }

  document.getElementById("firstTonicFreqInputErrorMessage").style.display = "none";
  //Si es válido, recargamos los chordBox
  //TODO
}  */

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
/* const playNewSound = (freq) => {
  return playExistingSound(generateAudioArrayFromNote(freq), 44100)
}
*/


