const { createNoteObject } = require('./tools/objectCreator.js');
const { playExistingSound, generateAudioArrayFromNote } = require("./tools/soundMotor.js")
//const {Chord}=require("./objects/Chord.js")
const Chord = require("./objects/Chord.js");
const { Interval, findIntervalByName } = require('./objects/Intervals.js');
const { Mode, findModeByName } = require('./objects/Modes.js');

const ipcRenderer = require("electron").ipcRenderer;

let chord = new Chord();







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
//Interacciones sencillas de front
//_____________________________
document
  .getElementById("song-controls-rythm")
  .addEventListener("click", function () {
    document.getElementById("bpmInput").focus();
  });

document
  .getElementById("new-chord-button")
  .addEventListener("click", () => {
    document.getElementById("chord-duration-input").value = null;
    document.getElementById("duration-error-text").classList.add("no-display")
    chord = new Chord();
    //Abrir popup de duración
    document.getElementById("modal-background").classList.remove("no-display");
    document.getElementById("chord-duration-modal").classList.remove("no-display");
  });


//Crucecitas de cerrar modal hay más de uno pero todos deben hacer lo mismo. Se queda aqui por ser comun a todos los dialogos
document.querySelectorAll(".close-modal-button")
  .forEach(element =>
    element.addEventListener("click", () => {
      document.getElementById("modal-background").classList.add("no-display");
      document.getElementById("chord-duration-modal").classList.add("no-display");
      document.getElementById("chord-intervals-modal").classList.add("no-display");
    })
  );




//Intervals modal
document.getElementById("go-back-to-intervals-modal-button")
  .addEventListener("click", () => {
    //Cerrar modal de duración
    document.getElementById("chord-duration-modal").classList.remove("no-display");
    //Abrir modal de intervalos
    document.getElementById("chord-intervals-modal").classList.add("no-display");
    //Recargar valores que había establecido
    document.getElementById("chord-duration-input").value = chord.duration;
  });

document.getElementById("go-to-octavation-modal-button")
  .addEventListener("click", () => {
    let modeSelectorValue = document.getElementById('mode-select').value;
    chord.setmode(findModeByName(modeSelectorValue));

    console.log(chord.getmode().getname())
    //Añadir acorde a cancion y crear el chordBox
  })








