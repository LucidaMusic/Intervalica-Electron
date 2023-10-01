//const ipcRenderer = require("electron").ipcRenderer;

//const { createNoteObject } = require("./tools/objectCreator.js");
//const { playExistingSound, generateAudioArrayFromNote } = require("./tools/soundMotor.js")
const Chord = require("./objects/Chord.js");
//const { Interval, findIntervalByName } = require("./objects/Intervals.js");
const { findModeByName } = require("./objects/Modes.js");

//Lista de acordes que forman la canción
const song = new Array();

//Esta variable se necesita porque se reutiliza cada vez que se pide un acorde nuevo
let inPreparationChord = new Chord();
let previousFreq;




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

const modalBackground = document.getElementById("modal-background");
const previousFreqModal = document.getElementById("previous-freq-modal");
const durationModal = document.getElementById("chord-duration-modal");

document
  .getElementById("new-chord-button")
  .addEventListener("click", () => {
    modalBackground.classList.remove("no-display");

    if (song.length == 0) {
      document.getElementById("chord-duration-input").value = null;
      document.getElementById("duration-error-text").classList.add("no-display");
      inPreparationChord = new Chord();
      //Abrir popup de duración
      /*     document.getElementById("modal-background").classList.remove("no-display");
          document.getElementById("chord-duration-modal").classList.remove("no-display");
       */
      durationModal.classList.remove("no-display");

    } else {
      previousFreqModal.classList.remove("no-display");
    }
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

//____________________________Duration modal_________________________________________
let chordDuration = document.getElementById("chord-duration-input");

//Adding action on Enter key
chordDuration.addEventListener("keydown", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submitButton").click();
  }
});

let durationInput = document.getElementById("chord-duration-input");
let continueButton = document.getElementById("continue-button");

["semiquaver-duration-option",
  "quaver-duration-option",
  "crotchet-duration-option",
  "minim-duration-option",
  "semibreve-duration-option"
]
  .forEach(id => {
    let figure = document.getElementById(id);
    figure
      .addEventListener("click", () => {
        document.querySelector("figure[class='selected']").classList.remove("selected");
        figure.classList.add("selected");
        durationInput.value = figure.getAttribute("duration");
        continueButton.focus();
        validateDuration();
      });
  });

//El botón cerrar en el modal de duración es equivalente a las crucecitas
document
  .getElementById("close-duration-modal-button")
  .addEventListener("click", () => {
    //Cerrar modal container
    document.getElementById("modal-background").classList.add("no-display");
    document.getElementById("chord-duration-modal").classList.add("no-display");
  });

//Ambos botones tienen el mismo comportamiento, avanzar a Modal de Intervalos
[document.getElementById("go-to-intervals-modal-button"), document.getElementById("continue-button")]
  .forEach(element =>
    element.addEventListener("click", () => {
      if (validateDuration()) {
        let chordDuration = document.getElementById("chord-duration-input").value;
        inPreparationChord.setDuration(chordDuration);
        //Cerrar modal de duración
        document.getElementById("chord-duration-modal").classList.add("no-display");
        //Abrir modal de intervalos
        document.getElementById("chord-intervals-modal").classList.remove("no-display");
      }
    })
  );


//____________________________Intervals modal_________________________________________
document.getElementById("go-back-to-intervals-modal-button")
  .addEventListener("click", () => {
    //Cerrar modal de duración
    document.getElementById("chord-duration-modal").classList.remove("no-display");
    //Abrir modal de intervalos
    document.getElementById("chord-intervals-modal").classList.add("no-display");
    //Recargar valores que había establecido
    document.getElementById("chord-duration-input").value = inPreparationChord.duration;
  });

document.getElementById("go-to-octavation-modal-button")
  .addEventListener("click", () => {
    let modeSelectorValue = document.getElementById("mode-select").value;
    inPreparationChord.setMode(findModeByName(modeSelectorValue));

    console.log(inPreparationChord.getMode().getName());
    console.log(inPreparationChord.getDuration());
    //Añadir acorde a cancion y crear el chordBox
    song.push(inPreparationChord);
  });



//Esta función se encarga de validar el campo de duración introducido manualmente por el usuario
//Desde aqui se muestran los mensajes de error
function validateDuration() {
  let chordDurationValue = document.getElementById("chord-duration-input").value;

  if (Number.isNaN(chordDurationValue) || chordDurationValue <= 0) {
    document.querySelector("#duration-error-text").classList.remove("no-display");
    return false;
  } else {
    document.querySelector("#duration-error-text").classList.add("no-display");
    return true;
  }
}




