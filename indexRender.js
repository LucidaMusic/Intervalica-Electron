//const ipcRenderer = require("electron").ipcRenderer;

const Chord = require("./objects/Chord.js");
const Note = require("./objects/Note.js");
const { getIntervalById, Intervals } = require("./objects/Intervals.js");
//const { Interval } = require("./objects/Intervals.js");
const { findModeByName } = require("./objects/Modes.js");

//Lista de acordes que forman la canción
const song = new Array();


//Variables para que tengan alcance global 
let inPreparationChord;
let previousFreqValue;
let selectedInterval = Intervals.UNISON;
let rootFreq;
//Variables configuración usuario
let relativeToSong = 0; //a la hora de dibujar las líneas del canvas. Por defecto se hace relativo al acorde

const MAXIMUM_FREQ_POSSIBLE = 8000;
const MINIMUM_FREQ_POSSIBLE = 20;

const CSS_noDisplay = "no-display"; //Clase css para esconder elemento
const CSS_selected = "selected"; //Clase css para seleccionar elemento



//___________________________Main page________________________________
const HTML_firstFreqInput = document.getElementById("freq-input")

//Limitar 1tonica input a 4 caracteres (Decimales??)
HTML_firstFreqInput
  .addEventListener("input", () => {
    const inputValue = HTML_firstFreqInput.value;
    if (inputValue.length >= 4) {
      HTML_firstFreqInput.value = inputValue.slice(0, 4);
    }
  });


//Crear nuevo acorde
document
  .getElementById("new-chord-button")
  .addEventListener("click", () => {
    //Preparamos el acorde a añadir
    inPreparationChord = new Chord();

    if (song.length == 0) {

      //Ya conozco previous freq y previous interval asi que los establezco
      previousFreq = HTML_firstFreqInput.value
      inPreparationChord.setPreviousInterval(Intervals.UNISON)
      //Abrir popup de duración
      showDialog(HTML_chordDurationModal);

    } else {

      let previousChord = song[song.length - 1];

      HTML_previousChordName.innerHTML = previousChord.name;

      paintLinesOnCanvas(previousChord, HTML_canvasInModal)

      //Hacemos que las barras tengan la funcionalidad de ser seleccionadas y su numero mostrado aparte
      HTML_canvasInModal.addEventListener("click", function (event) {
        const chordViewLineContainer = event.target.closest(".chord-view-line-container");
        if (chordViewLineContainer) {
          // Obtener valor de frecuencia
          let noteId = chordViewLineContainer.getAttribute("data-note-id");
          let selectedPreviousNote = song[song.length - 1].notes.find(note => note.id == noteId);
          previousFreqDesiredValue = selectedPreviousNote.freq;
          //const previousFreqDesiredValue = chordViewLineContainer.querySelector(".chord-view-line-number").textContent;

          // Mostramos el valor clickado
          HTML_clickedPreviousFreqSpan.innerHTML = previousFreqDesiredValue;

          //Devuelve el valor blurred al que ya estaba seleccionado (si lo estaba)
          HTML_canvasInModal.querySelectorAll(".chord-view-line-container:not(.blurred)")
            .forEach(element => element.classList.add("blurred"));

          //Dejamos seleccionado el numero que sea
          chordViewLineContainer.classList.remove("blurred")

          //Al haber seleccionado un valor, si los botones están disabled, se activan
          /*           if (HTML_setPreviousFreqButtonQuick.disabled) {
                      HTML_setPreviousFreqButtonQuick.disabled = false;
                    }
                    if (HTML_setPreviousFreqButton.disabled) {
                      HTML_setPreviousFreqButton.disabled = false;
                    }
           */
          //Además se esconde el texto de error
          hideErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
        }
      });

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
const HTML_clickedPreviousFreqSpan = document.getElementById("previous-freq-span");
const HTML_previousFreqErrorText = document.getElementById("previous-freq-error-text");
const HTML_setPreviousFreqButton = document.getElementById("set-previous-freq");
const HTML_setPreviousFreqButtonQuick = document.getElementById("set-previous-freq-quick");
const HTML_previousChordName = document.getElementById("previous-chord-name");
const HTML_canvasInModal = HTML_previousFreqModal.querySelector(".chord-view");

//Acción botones siguiente
[HTML_setPreviousFreqButton,
  HTML_setPreviousFreqButtonQuick]
  .forEach(element => {
    element.addEventListener("click", () => {
      //Encontrar elemento seleccionado y coger su data-note-id
      let selectedNoteId = HTML_canvasInModal.querySelector(".chord-view-line-container:not(.blurred)").getAttribute("data-note-id")
      //Buscar en el acorde anterior la nota con ese id
      //Por ahora se entiende como acorde anterior el último ya existente 
      let selectedNote = song[song.length - 1].notes.find(note => note.id == selectedNoteId)
      //Marcarle el definesNextChord a true
      selectedNote.definesNextChord = true;
      //Los dos span de previous interval se rellenan con el valor de la frecuencia seleccionada
      previousFreqValue = selectedNote.freq;

      HTML_previousFreqSpan.innerHTML = previousFreqValue;
      //Hay que calcular la frecuencia porque el intervalo no tiene porque ser unisono, por ejemplo si hemos navegado hacia atras con otro intervalo
      HTML_newFreqSpan.innerHTML = previousFreqValue * selectedInterval.numberValue;
    });
  })


//_____________________________Previous interval modal_____________________________
const HTML_previousFreqSpan = document.getElementById("previous-freq");
const HTML_newFreqSpan = document.getElementById("new-freq");
const HTML_intervalFractionValueSpan = document.getElementById("interval-fraction-value");
const HTML_previousFreqSelect = document.getElementById("previous-freq-select");
const HTML_setPreviousIntervalButton = document.getElementById("set-previous-interval-button")

// Actualizar la previsualizacion cuando se elige una opcion en el selector de intervalos
HTML_previousFreqSelect.addEventListener('change', () => {
  // Obtén el valor de la opción seleccionada
  selectedInterval = getIntervalById(HTML_previousFreqSelect.options[HTML_previousFreqSelect.selectedIndex].getAttribute("data-value"));

  HTML_intervalFractionValueSpan.innerHTML = "(" + selectedInterval.stringValue + ")";

  HTML_newFreqSpan.innerHTML = previousFreqValue * selectedInterval.numberValue;
});

HTML_setPreviousIntervalButton.addEventListener("click", () => {
  rootFreq = previousFreqValue * selectedInterval.numberValue;

  //Pintamos el root freq en el canvas
  paintLinesOnCanvasModes([rootFreq], HTML_canvasMode)
})




//____________________________Intervals modal (Modo y extensiones)_________________________________________
const HTML_modeUl = document.getElementById("mode-ul")
const HTML_noModesContainer = document.querySelector(".no-modes-container");
const HTML_actionInput = document.getElementById("action-input");
const HTML_actionInputName = document.getElementById("action-input-name");
const HTML_extensionsUl = document.getElementById("extensions-ul");
const HTML_backToIntervalsParents = document.getElementById("return-to-intervals-parents-button");
const HTML_addIntervalButton = document.getElementById("add-interval-button")
const HTML_canvasMode = HTML_chordIntervalsModal.querySelector(".chord-view");

let noModes = false;

HTML_actionInput.addEventListener("click", () => {
  // Cambiar el estado de isMoved y actualizar el estilo
  noModes = !noModes;
  HTML_noModesContainer.style.transform = noModes ? "translateY(0)" : "translateY(100%)";
  HTML_actionInputName.innerHTML = noModes ? "Sí quiero elegir un modo" : "No quiero elegir ningún modo"
});

//Los modos se seleccionan cuando son clicados
//Se que son modos si son figures dentro de mode-ul
HTML_modeUl
  .querySelectorAll("figure")
  .forEach(figure => {
    figure
      .addEventListener("click", () => {
        unselectElement(HTML_modeUl.querySelector("figure." + CSS_selected))
        selectElement(figure)
        //HTML_durationInput.value = figure.getAttribute("data-value");
        //HTML_setDurationButton.focus();
        //validateDuration();
      });
  });

//Los intervalos, cuando son clicados, muestran sus hijos
HTML_extensionsUl.querySelectorAll(".parent")
  .forEach(parent => {
    parent
      .addEventListener("click", () => {
        //Esconder todos los padres
        HTML_extensionsUl
          .querySelectorAll(".parent")
          .forEach(parent => hideElement(parent))

        //Mostrar los hijos de ese padre concreto
        let classOfChildToShow = parent.getAttribute("data-value");

        HTML_extensionsUl
          .querySelectorAll("." + classOfChildToShow)
          .forEach(child => showElement(child))

        //Mostrar boton para volver
        showElement(HTML_backToIntervalsParents)
      });
  });

//Los hijos, cuando son clicados, se seleccionan y muestran el botón añadir.
HTML_extensionsUl
  .querySelectorAll(".child")
  .forEach(figure => {
    figure
      .addEventListener("click", () => {
        //Deseleccionar si ya había algo seleccionado, dado que los intervalos son opcionales y no tienen un default claro. No tendria que haber mas de un selected
        deselectPossiblySelectedChildInterval();
        selectElement(figure)
        showElement(HTML_addIntervalButton);
      });
  });


//boton volver esconde los hijos, muestra los padres y se esconde a si mismo
HTML_backToIntervalsParents.addEventListener("click", () => {
  //Se entiende que si se había seleccionado algo antes, se descarta
  deselectPossiblySelectedChildInterval();
  //buscar todos los child que NO tengan no display y esconderlos
  HTML_extensionsUl.querySelectorAll(".child:not(." + CSS_noDisplay + ")")
    .forEach(element => hideElement(element))
  //buscar todos los parents y mostrarlos
  HTML_extensionsUl.querySelectorAll(".parent")
    .forEach(element => showElement(element))
  //Se esconde a sí mismo
  hideElement(HTML_backToIntervalsParents)
  //Esconde el boton añadir dado que estoy en parents
  hideElement(HTML_addIntervalButton)
})

function deselectPossiblySelectedChildInterval() {
  const selectedChildInterval = HTML_extensionsUl.querySelector(".child." + CSS_selected)
  if (selectedChildInterval) {
    unselectElement(selectedChildInterval)
  }
}


//El boton + añade el intervalo
HTML_addIntervalButton
  .addEventListener("click", () => {
    //busco los intervals child
    const intervalId = HTML_extensionsUl.querySelector(".child.selected").getAttribute("data-value")
    //   busco el que tenga la clase selected !Solo debe haber uno
    //  cojo su data value
    // busco el intervalo y lo pinto Deberia insertar objetos html

    // Crear un elemento <p>
    var HTML_chosenInterval = document.createElement("p");

    // Establecer el texto dentro del párrafo
    HTML_chosenInterval.textContent = getIntervalById(intervalId).getName();

    // Agregar el párrafo al cuerpo del documento (u otro elemento, según tu necesidad)
    HTML_chordIntervalsModal.appendChild(HTML_chosenInterval);

    //   a la hora de recuperar el valor podria volver a leer los elementos para no tener que mantener una lista sincronizada de intervalos
  });


//____________________________Octavation modal_________________________________________



//____________________________Duration modal_________________________________________
const HTML_durationInput = document.getElementById("chord-duration-input");
const HTML_durationUl = document.getElementById("duration-ul");

let HTML_setDurationButton = document.getElementById("set-duration-button");

//Cada figura musical. al clicarle, rellenará el campo con la duración asociada
HTML_durationUl.querySelectorAll("figure")
  .forEach(figure => {
    figure
      .addEventListener("click", () => {
        unselectElement(HTML_durationUl.querySelector("figure." + CSS_selected))
        selectElement(figure)
        HTML_durationInput.value = figure.getAttribute("data-value");
        HTML_setDurationButton.focus();
        validateDuration();
      });
  });

HTML_setDurationButton.addEventListener("click", () => {
  inPreparationChord.duration = HTML_durationInput.value;
});

HTML_setDurationButton
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

/* function validatePreviousFreq(previousFreqValue) {
  if (previousFreqValue == "") {
    HTML_previousFreqErrorText.innerHTML = "No hay valor introducido";
    showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton, HTML_setPreviousFreqButtonQuick);
  } else if (previousFreqValue < MINIMUM_FREQ_POSSIBLE) {
    HTML_previousFreqErrorText.innerHTML = `El valor introducido es demasiado bajo. Utiliza frecuencias por encima de ${MINIMUM_FREQ_POSSIBLE}`
    showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton, HTML_setPreviousFreqButtonQuick);
  } else if (previousFreqValue > MAXIMUM_FREQ_POSSIBLE) {
    HTML_previousFreqErrorText.innerHTML = `El valor introducido es demasiado alto. Utiliza frecuencias por debajo de ${MAXIMUM_FREQ_POSSIBLE}`
    showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton, HTML_setPreviousFreqButtonQuick);
  } else {
    hideErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButton, HTML_setPreviousFreqButtonQuick);
    return true;
  }
  return false;
} */

//Esta función se encarga de validar el campo de duración introducido manualmente por el usuario
//Desde aqui se muestran los mensajes de error
function validateDuration(durationValue) {
  if (Number.isNaN(durationValue) || durationValue <= 0) {
    showElement(durationErrorText)
    return false;
  } else {
    hideElement(durationErrorText)
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

function paintLinesOnCanvas(chord, canvas) {
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

function paintLinesOnCanvasModes(freqs, canvas) {
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


//Temporalmente necesito que haya un acorde ya creado
let testingAlreadyCreatedChord = new Chord();
testingAlreadyCreatedChord.name = "Napolitano sobre C";


testingAlreadyCreatedChord.duration = 1;
testingAlreadyCreatedChord.mode = findModeByName("Menor");
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
