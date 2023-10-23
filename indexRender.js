//const ipcRenderer = require("electron").ipcRenderer;

const Chord = require("./objects/Chord.js");
const Note = require("./objects/Note.js");
const { getIntervalById, Intervals } = require("./objects/Intervals.js");
const { findModeById, Modes } = require("./objects/Modes.js");

//Variables configuración usuario
let relativeToSong = 0; //a la hora de dibujar las líneas del canvas. Por defecto se hace relativo al acorde

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


//HTML Variables
//Main page
const HTML_firstFreqInput = document.getElementById("freq-input")
const HTML_modalBackground = document.getElementById("modal-background");

//Previous Freq
const HTML_previousFreqModal = document.getElementById("previous-freq-modal");
const HTML_clickedPreviousFreqSpan = document.getElementById("previous-freq-span");
const HTML_previousFreqErrorText = document.getElementById("previous-freq-error-text");
const HTML_setPreviousFreqButton = document.getElementById("set-previous-freq");
const HTML_setPreviousFreqButtonQuick = document.getElementById("set-previous-freq-quick");
const HTML_previousChordName = document.getElementById("previous-chord-name");
const HTML_canvasInModal = HTML_previousFreqModal.querySelector(".chord-view"); //cambiar nombre canvasPrevFreq
//Previous Interval
const HTML_previousIntervalModal = document.getElementById("previous-interval-modal");
const HTML_previousFreqSpan = document.getElementById("previous-freq");
const HTML_newFreqSpan = document.getElementById("new-freq");
const HTML_intervalFractionValueSpan = document.getElementById("interval-fraction-value");
const HTML_previousFreqSelect = document.getElementById("previous-freq-select");
const HTML_setPreviousIntervalButton = document.getElementById("set-previous-interval-button")
//Mode and extensions
const HTML_chordIntervalsModal = document.getElementById("chord-intervals-modal");
const HTML_modeUl = document.getElementById("mode-ul")
const HTML_noModesContainer = document.querySelector(".no-modes-container");
const HTML_modeToggler = document.getElementById("mode-toggler");
const HTML_modeTogglerText = document.getElementById("mode-toggler-text");
const HTML_extensionsUl = document.getElementById("extensions-ul");
const HTML_backToIntervalsParents = document.getElementById("return-to-intervals-parents-button");
const HTML_addIntervalButton = document.getElementById("add-interval-button");
const HTML_canvasMode = HTML_chordIntervalsModal.querySelector(".chord-view");


// ______________________________Comun dialogs_______________________________________

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

          //Establecer en el acorde anterior que nota es la que define este
          //Establecer en el acorde en preparación elprevious interval
          //Establecer en el acorde el modo y ña lista de extensiones
          //
        }
      });
  });



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

function showElement(element) {
  element.classList.remove(CSS_noDisplay)
}

function hideElement(element) {
  element.classList.add(CSS_noDisplay)
}

function resetModalValues() {
  //Previous Freq
  HTML_clickedPreviousFreqSpan.innerHTML = null;
  HTML_durationInput.value = null;
  showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
  //Previous Interval
  selectedInterval = Intervals.UNISON;
  HTML_previousFreqSelect.selectedIndex = 0;

}

function showErrorText(errorText, ...buttonToDisable) {
  errorText.classList.remove("transparent-text");
  buttonToDisable.forEach(button => button.disabled = true);
}

function hideErrorText(errorText, ...buttonToEnable) {
  errorText.classList.add("transparent-text");
  buttonToEnable.forEach(button => button.disabled = false);
}

function showElement(element) {
  element.classList.remove(CSS_noDisplay)
}

function hideElement(element) {
  element.classList.add(CSS_noDisplay)
}

function selectElement(element) {
  element.classList.add(CSS_selected);
}

function unselectElement(element) {
  element.classList.remove(CSS_selected);
}

let noteId = 0;
function createNoteId() {
  noteId += 1;
  return noteId;
}

function paintLinesOnCanvas(chord, canvas) { //cambiar rl nombre porque solo sirve oara canvasPrevFreq. Si estas funciones van a usar un canvas en concreto mejor ni pasarlo como parámetro 
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

    canvas.appendChild(lineParent);
  }
}

function paintLinesOnCanvasModes(freqs, canvas) { //paintLinesOnModesAndExtensionsCanvas, lo mismo, para qué pasar canvas. Además mejor mover a su modulo
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

    canvas.appendChild(lineParent);
  }
}

function updateModeCanvas() {
  //Reiniciar canvas mode
  [...HTML_canvasMode.children]
    .forEach(child => {
      HTML_canvasMode.removeChild(child);
    });

  //cogemos el modo seleccionado
  let selectedModeId = HTML_modeUl.querySelector("figure." + CSS_selected).getAttribute("data-mode-id")
  let selectedMode = findModeById(selectedModeId)

  //Calculamos rootFreq
  rootFreq = userSelectedPreviousFreqValue * selectedInterval.numberValue;

  //cogemos sus intervalos y a cada uno le cogemos su numberValue y lo multiplicamos por la rootFreq
  let modeFreqs = selectedMode.intervals
    .map(interval => interval.numberValue * rootFreq)

  //Omitimos extensiones por ahora 
  let extensionsFreqs = []

  //Pintamos las frecuencias en el canvas
  paintLinesOnCanvasModes([rootFreq, ...modeFreqs, ...extensionsFreqs], HTML_canvasMode)
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


