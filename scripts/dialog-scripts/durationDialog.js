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
