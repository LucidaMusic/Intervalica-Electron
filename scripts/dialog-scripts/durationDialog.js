
const HTML_chordDurationModal = document.getElementById("chord-duration-modal");
const HTML_durationInput = document.getElementById("chord-duration-input");
const HTML_durationUl = document.getElementById("duration-ul");
const durationErrorText = document.getElementById("duration-error-text");
//Campos de donde coger los datos al final
const HTML_previousFreq = document.getElementById("previous-freq-span");
const HTML_previousIntervalSelect = document.getElementById("previous-interval-select");
//const HTML_modeUl = document.getElementById("mode-ul");
//const durationErrorText = document.getElementById("mode-ul");
//const durationErrorText = document.getElementById("duration-error-text");


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
        validateDuration();
      });
  });


HTML_setDurationButton
  .addEventListener("click", () => {
    console.log("Frecuencia de tonica")
    console.log("Modo:");
    console.log(getSelectedModeValue());
    //Cogemos todos los datos 
/*     let modeSelectorValue = document.getElementById("mode-select").value;
    inPreparationChord.
    inPreparationChord.setMode(findModeByName(modeSelectorValue));

    console.log(inPreparationChord.toString());
    //Añadir acorde a cancion y crear el chordBox
    song.push(inPreparationChord); */
  });
