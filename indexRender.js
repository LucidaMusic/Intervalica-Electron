//const ipcRenderer = require("electron").ipcRenderer;

const Chord = require("./objects/Chord.js");
const { Interval, findIntervalByName } = require("./objects/Intervals.js");
//const { Interval } = require("./objects/Intervals.js");
const { findModeByName } = require("./objects/Modes.js");

//Lista de acordes que forman la canción
const song = new Array();

//Temporalmente necesito que haya un acorde ya creado
let testingAlreadyCreatedChord = new Chord();
testingAlreadyCreatedChord.setName("Napolitano sobre C")
testingAlreadyCreatedChord.setDuration(1);
testingAlreadyCreatedChord.setMode(findModeByName("Menor"));
testingAlreadyCreatedChord.setContextualizedFreqs([330, 440, 550, 660, 880]);
testingAlreadyCreatedChord.setPreviousInterval(Interval.JUST_FIFTH);
song.push(testingAlreadyCreatedChord);

//Variables para que tengan alcance global 
let inPreparationChord,
  previousFreq;

//Variables configuración usuario
let relativeToSong = 0; //a la hora de dibujar las líneas del canvas. Por defecto se hace relativo al acorde

const MAXIMUM_FREQ_POSSIBLE = 8000;
const MINIMUM_FREQ_POSSIBLE = 20;


//___________________________Main page________________________________
const firstFreqInput = document.getElementById("freq-input")
//Crear nuevo acorde
document
  .getElementById("new-chord-button")
  .addEventListener("click", () => {
    //Preparamos el acorde a añadir
    inPreparationChord = new Chord();

    if (song.length == 0) {

      //Ya conozco previous freq y previous interval asi que los establezco
      previousFreq = firstFreqInput.value
      inPreparationChord.setPreviousInterval(Intervals.UNISON)
      //Abrir popup de duración
      showDialog(HTML_chordDurationModal);

    } else {

      let previousChord = song[song.length - 1];

      HTML_previousChordName.innerHTML = previousChord.getName();

      //Calculamos nota máxima y minima sobre las que queremos pintar
      //Datos de entrada

      let previousChordFreqs = previousChord.getContextualizedFreqs();

      let maxFreqValue, minFreqValue;

      if (relativeToSong) {
        let allNotesFromSong = [].concat(...song);

        maxFreqValue = Math.max(...allNotesFromSong);
        minFreqValue = Math.min(...allNotesFromSong);
      } else {      //Default is relative to chord
        maxFreqValue = Math.max(...previousChordFreqs);
        minFreqValue = Math.min(...previousChordFreqs);
      }

      //Dado que necesito mas espacio
      //Esto se puede calcular teniendo en cuenta el tamaño de las letras
      maxFreqValue *= 1.2;
      minFreqValue *= 0.8;

      //Establecemos valores que sirven para calcular punto y de las lineas en escala logarítmica 
      let minLogFreq = Math.log(minFreqValue) / Math.log(10);
      let logRange = (Math.log(maxFreqValue) / Math.log(10)) - minLogFreq;

      const canvasInModal = document.querySelector(".chord-view");

      let height = 500; //Height real del canvas o contenedor

      //Para cada nota en el acorde
      for (let i = 0; i < previousChordFreqs.length; i++) {
        //Leemos el valor de la frecuencia
        let chordFreq = previousChordFreqs[i];

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

        canvasInModal.appendChild(lineParent);
      }

      const freqInput = document.getElementById("previous-freq-input");

      //Hacemos que las barras tengan la funcionalidad de ser seleccionadas y su numero mostrado aparte
      canvasInModal.addEventListener("click", function (event) {
        const chordViewLineContainer = event.target.closest(".chord-view-line-container");
        if (chordViewLineContainer) {
          // Obtener el texto dentro del <span>
          const previousFreqDesiredValue = chordViewLineContainer.querySelector(".chord-view-line-number").textContent;

          // Mostramos el valor clickado
          freqInput.value = previousFreqDesiredValue;

          // Dispara manualmente el evento 'input' después de cambiar el valor para que se ejecute la validacion
          freqInput.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true,
          }));

          //Devuelve el valor blurred al que ya estaba seleccionado (si lo estaba)
          canvasInModal.querySelectorAll(".chord-view-line-container:not(.blurred)")
            .forEach(element => element.classList.add("blurred"));

          //Dejamos seleccionado el numero que sea
          chordViewLineContainer.classList.remove("blurred")
        }
      });

      //Inicializamos el valor del input previous freq para evitar nulos
      //Por ahora hacemos así pero debería ser la tónica más grave (aun no hay distinción por tónica)
      HTML_previousFreqInput.value = previousChordFreqs[0];

      // Dispara manualmente el evento 'input' después de cambiar el valor
      HTML_previousFreqInput.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true,
      }));

      showDialog(HTML_previousFreqModal);

      //Encuentra cual sería la posición Y de la barra y texto de una nota teniendo en cuenta la frecuencia 
      //mayor y menor de la canción, en función a la frecuencia
      function canvas_calculateFreqBarYPosition(frequency, height) {
        return (Math.log(frequency) / Math.log(10) - minLogFreq) / logRange * height;
      }
    }
  });


//__________________________Variables HTML_______________________________________
//Todos los modales y el fondo
const HTML_modalBackground = document.getElementById("modal-background");
const HTML_previousFreqModal = document.getElementById("previous-freq-modal");
const HTML_previousIntervalModal = document.getElementById("previous-interval-modal");
const HTML_chordDurationModal = document.getElementById("chord-duration-modal");
const HTML_chordIntervalsModal = document.getElementById("chord-intervals-modal");
const HTML_octavationModal = document.getElementById("octavation-modal");



//____________________________Previous Freq Modal
const HTML_previousFreqInput = document.getElementById("previous-freq-input");
const HTML_previousFreqErrorText = document.getElementById("previous-freq-error-text");
const HTML_setPreviousFreqButton = document.getElementById("set-previous-freq");
const HTML_previousChordName = document.getElementById("previous-chord-name");

HTML_previousFreqInput.addEventListener("input", () => {
  validatePreviousFreq(HTML_previousFreqInput.value);
});

HTML_setPreviousFreqButton.addEventListener("click", () => {
  let previousFreqValue = HTML_previousFreqInput.value

  previousFreq = previousFreqValue;
  HTML_previousFreqSpan.innerHTML = previousFreq;

  HTML_newFreqSpan.innerHTML = previousFreq;
});


//_____________________________Previous interval modal_____________________________
const HTML_previousFreqSpan = document.getElementById("previous-freq");
const HTML_newFreqSpan = document.getElementById("new-freq");
const HTML_intervalFractionValueSpan = document.getElementById("interval-fraction-value");
const HTML_previousFreqSelect = document.getElementById("previous-freq-select");

// Actualizar la previsualizacion cuando se elige una opcion en el selector de intervalos
HTML_previousFreqSelect.addEventListener('change', function () {
  // Obtén el valor de la opción seleccionada
  let selectedInterval = findIntervalByName(HTML_previousFreqSelect.value);

  HTML_intervalFractionValueSpan.innerHTML = "(" + selectedInterval.getStringValue() + ")";
  HTML_newFreqSpan.innerHTML = previousFreq * selectedInterval.getNumberValue();
});


//____________________________Duration modal_________________________________________
let HTML_durationInput = document.getElementById("chord-duration-input");

//Si se pulsa Enter en el input, nos lleva a la siguiente pagina
/* durationInput.addEventListener("keydown", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submitButton").click();
  }
}); */ //De momento prohíbo introducir valores personalizados

let HTML_setDurationButton = document.getElementById("set-duration-button");

//Cada figura musical. al clicarle, rellenará el campo con la duración asociada
["semiquaver-duration-option",
  "quaver-duration-option",
  "crotchet-duration-option",
  "minim-duration-option",
  "semibreve-duration-option"
].forEach(id => {
  let figure = document.getElementById(id);
  figure
    .addEventListener("click", () => {
      //Cuidado! Ahora hay mas figures
      document.querySelector("figure[class='selected']").classList.remove("selected");
      figure.classList.add("selected");
      HTML_durationInput.value = figure.getAttribute("data-duration");
      HTML_setDurationButton.focus();
      validateDuration();
    });
});

HTML_setDurationButton.addEventListener("click", () => {
  inPreparationChord.setDuration(HTML_durationInput.value)
});



//____________________________Intervals modal (Modo y extensiones)_________________________________________
const HTML_noModesContainer = document.querySelector(".no-modes-container");
const HTML_actionInput = document.getElementById("action-input");
const HTML_actionInputName = document.getElementById("action-input-name");

let noModes = false;

HTML_actionInput.addEventListener("click", () => {
  // Cambiar el estado de isMoved y actualizar el estilo
  noModes = !noModes;
  HTML_noModesContainer.style.transform = noModes ? "translateY(0)" : "translateY(100%)";
  HTML_actionInputName.innerHTML = noModes ? "Sí quiero elegir un modo" : "No quiero elegir ningún modo"
});

//____________________________Octavation modal_________________________________________

document.getElementById("finish-chord-creation-button")
  .addEventListener("click", () => {
    //Deberia ser aqui donde seteo todos los parametros en inPreparationChord, dado que es posible que estemos haciendo mierdas para que no se guarde nada.
    //Tampoco deberia ser necesario guardar los valores en otro sitio que no sea el propio HTML
    //Se puede recuperar directamente desde ahi
    let modeSelectorValue = document.getElementById("mode-select").value;
    inPreparationChord.setMode(findModeByName(modeSelectorValue));

    console.log(inPreparationChord.toString());
    //Añadir acorde a cancion y crear el chordBox
    song.push(inPreparationChord);
  });

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
        }
      });
  });


const durationErrorText = document.getElementById("duration-error-text");

function validatePreviousFreq(previousFreqValue) {
  if (previousFreqValue < MINIMUM_FREQ_POSSIBLE) {
    HTML_previousFreqErrorText.innerHTML = `El valor introducido es demasiado bajo. Utiliza frecuencias por encima de ${MINIMUM_FREQ_POSSIBLE}`
    showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton);
  } else if (previousFreqValue > MAXIMUM_FREQ_POSSIBLE) {
    HTML_previousFreqErrorText.innerHTML = `El valor introducido es demasiado alto. Utiliza frecuencias por debajo de ${MAXIMUM_FREQ_POSSIBLE}`
    showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton);
  } else {
    hideErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton);
    return true;
  }
  return false;
}

//Esta función se encarga de validar el campo de duración introducido manualmente por el usuario
//Desde aqui se muestran los mensajes de error
function validateDuration(durationValue) {
  if (Number.isNaN(durationValue) || durationValue <= 0) {
    durationErrorText.classList.remove("no-display");
    return false;
  } else {
    durationErrorText.classList.add("no-display");
    return true;
  }
}

function hideShownDialogs() {
  [HTML_modalBackground,
    HTML_previousFreqModal,
    HTML_previousIntervalModal,
    HTML_chordDurationModal,
    durationErrorText,
    HTML_chordIntervalsModal,
    HTML_octavationModal]
    .forEach(dialog => {
      if (!dialog.classList.contains("no-display")) {
        dialog.classList.add("no-display");
      }
    });
}

function showDialog(dialog) {
  HTML_modalBackground.classList.remove("no-display");
  dialog.classList.remove("no-display");
}

function resetModalValues() {
  HTML_previousFreqInput.value = null;
  HTML_durationInput.value = null;
}

function showErrorText(errorText, buttonToDisable) {
  errorText.classList.remove("transparent-text");
  buttonToDisable.disabled = true;
}

function hideErrorText(errorText, buttonToEnable) {
  errorText.classList.add("transparent-text");
  buttonToEnable.disabled = false;
}




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
