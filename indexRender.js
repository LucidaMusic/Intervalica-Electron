//const ipcRenderer = require("electron").ipcRenderer;

const Chord = require("./objects/Chord.js");
const { Interval, findIntervalByName } = require("./objects/Intervals.js");
//const { Interval } = require("./objects/Intervals.js");
const { findModeByName } = require("./objects/Modes.js");

//Lista de acordes que forman la canción
const song = new Array();

//Temporalmente necesito que haya un acorde ya creado
let testingAlreadyCreatedChord = new Chord();
testingAlreadyCreatedChord.setDuration(1);
testingAlreadyCreatedChord.setMode(findModeByName("Menor"));
testingAlreadyCreatedChord.setContextualizedFreqs([330, 440, 550, 660, 880]);
testingAlreadyCreatedChord.setPreviousInterval(Interval.JUST_FIFTH);
song.push(testingAlreadyCreatedChord);

//Esta variable se necesita porque se reutiliza cada vez que se pide un acorde nuevo
let inPreparationChord = new Chord();
let previousFreq;




//___________________________Main page________________________________
document
  .getElementById("new-chord-button")
  .addEventListener("click", () => {
    if (song.length == 0) {
      inPreparationChord = new Chord();
      //Ya conozco previous freq y previous interval asi que los establezco

      //Abrir popup de duración
      showDialog(chordDurationModal);

    } else {
      showDialog(previousFreqModal);
      //Calculamos nota máxima y minima sobre las que queremos pintar
      let chordA = song[0];
      console.log(chordA.getContextualizedFreqs());

      //Datos de entrada
      let song_min_freq = 330;
      let song_max_freq = 880;

      //Dado que necesito mas espacio
      song_max_freq *= 1.2;
      song_min_freq *= 0.8;

      //Establecemos valores que sirven para calcular punto y de las lineas
      let min_f = Math.log(song_min_freq) / Math.log(10);
      let max_f = Math.log(song_max_freq) / Math.log(10);
      let range = max_f - min_f;

      let chordFreqs = chordA.getContextualizedFreqs();

      //Hacemos que las barras tengan la funcionalidad de ser seleccionadas y su numero mostrado aparte
      const canvasInModal = document.querySelector(".chord-view");
      const freqInput = document.getElementById("previous-freq-input");

      canvasInModal.addEventListener("click", function (event) {
        const chordViewLineContainer = event.target.closest(".chord-view-line-container");
        if (chordViewLineContainer) {
          // Obtener el texto dentro del <span>
          const previousFreqDesiredValue = chordViewLineContainer.querySelector(".chord-view-line-number").textContent;

          // Mostramos el valor seleccionado
          freqInput.value = previousFreqDesiredValue;

          //Aádir todos los blurred
          canvasInModal.querySelectorAll(".chord-view-line-container")
            .forEach(element => element.classList.add("blurred"));

          //Dejamos seleccionado el numero que sea
          chordViewLineContainer.classList.remove("blurred")
        }
      });

      let height = 500;

      //Para cada nota en el acorde
      for (let i = 0; i < chordFreqs.length; i++) {
        //Leemos el valor de la frecuencia
        let chordFreq = chordFreqs[i];

        //Calculamos posición en Y para la barra y el texto
        let yPosition = canvas_calculateFreqBarYPosition(chordFreq, height);

        //Dinujamos linea
        let line = document.createElement("div");
        line.classList.add("chord-view-line");

        //Dibujamos numero
        let number = document.createElement("span");
        number.innerHTML = chordFreq;

        number.classList.add("chord-view-line-number");

        //Dibujamos parent
        let lineParent = document.createElement("div");
        lineParent.appendChild(number);
        lineParent.appendChild(line);

        lineParent.style.top = yPosition + "px";
        lineParent.classList.add("chord-view-line-container");
        lineParent.classList.add("blurred");

        canvasInModal.appendChild(lineParent);
      }


      //Encuentra cual sería la posición Y de la barra y texto de una nota teniendo en cuenta la frecuencia 
      //mayor y menor de la canción, en función a la frecuencia
      function canvas_calculateFreqBarYPosition(frequency, height) {
        position_px = (Math.log(frequency) / Math.log(10) - min_f) / range * height;
        //Supongo
        position_px = height - position_px;
        return position_px;
      }

    }
  });


//__________________________Variables HTML_______________________________________
//Todos los modales y el fondo
const modalBackground = document.getElementById("modal-background");
const previousFreqModal = document.getElementById("previous-freq-modal");
const previousIntervalModal = document.getElementById("previous-interval-modal");
const chordDurationModal = document.getElementById("chord-duration-modal");
const chordIntervalsModal = document.getElementById("chord-intervals-modal");
const octavationModal = document.getElementById("octavation-modal");



//____________________________Previous Freq Modal
const previousFreqInput = document.getElementById("previous-freq-input");
//const setPreviousFreqButton = document.getElementById("set-previous-freq");



//_____________________________Previous interval modal_____________________________
const previousFreqSpan = document.getElementById("previous-freq");
const newFreqSpan = document.getElementById("new-freq");
const intervalFractionValueSpan = document.getElementById("interval-fraction-value");


document.getElementById("set-previous-interval-button")
  .addEventListener("click", () => {
    const previousInterval = findIntervalByName(document.getElementById("previous-freq-select").value);
    inPreparationChord.setPreviousInterval(previousInterval);
    console.log(inPreparationChord.getPreviousInterval().getNumberValue());
  })

var previousFreqSelect = document.getElementById('previous-freq-select');

// Agrega un event listener para el evento 'change'
previousFreqSelect.addEventListener('change', function () {
  // Obtén el valor de la opción seleccionada
  var selectedValue = select.value;

  // Realiza alguna acción basada en la opción seleccionada
  console.log('Opción seleccionada:', selectedValue);
});

//____________________________Duration modal_________________________________________
let durationInput = document.getElementById("chord-duration-input");

//Si se pulsa Enter en el input, nos lleva a la siguiente pagina
durationInput.addEventListener("keydown", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submitButton").click();
  }
});

let continueButton = document.getElementById("continue-button");

//Cada figura musical. al clicarle, rellenará el campo con la duración asociada
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



//____________________________Intervals modal_________________________________________


document.getElementById("finish-chord-creation-button")
  .addEventListener("click", () => {
    let modeSelectorValue = document.getElementById("mode-select").value;
    inPreparationChord.setMode(findModeByName(modeSelectorValue));

    console.log(inPreparationChord.getMode().getName());
    console.log(inPreparationChord.getDuration());
    //Añadir acorde a cancion y crear el chordBox
    song.push(inPreparationChord);
  });

// ______________________________Comun dialogs_______________________________________

//Esto da la funcionalidad a los botones de desplazarse a otra pagina
document.querySelectorAll("[go-to]")
  .forEach(element => {
    element
      .addEventListener("click", () => {
        hideAllDialogs();

        let whereToGo = element.getAttribute("go-to");
        switch (whereToGo) {
          case "close":
            break;
          case "previous-freq-modal":
            showDialog(previousFreqModal);
            break;
          case "previous-interval-modal":
            if (validatePreviousFreq()) {
              previousFreq = previousFreqInput.value;
              previousFreqSpan.innerHTML = previousFreq;
              newFreqSpan.innerHTML = previousFreq;
              showDialog(previousIntervalModal);
            }
            break;
          case "chord-duration-modal":
            showDialog(chordDurationModal);
            break;
          case "chord-intervals-modal":
            showDialog(chordIntervalsModal);
            break;
          case "octavation-modal":
            showDialog(octavationModal);
            break;
        }
      });
  });


const durationErrorText = document.getElementById("duration-error-text");

function validatePreviousFreq() {
  return true;
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

function hideAllDialogs() {
  [modalBackground,
    previousFreqModal,
    previousIntervalModal,
    chordDurationModal, durationErrorText,
    chordIntervalsModal,
    octavationModal].forEach(dialog => dialog.classList.add("no-display"));
  resetModalValues();
}

function showDialog(dialog) {
  modalBackground.classList.remove("no-display");
  dialog.classList.remove("no-display");
}

function resetModalValues() {
  durationInput.value = null;
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
