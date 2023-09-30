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
})

let durationInput = document.getElementById("chord-duration-input");
let continueButton = document.getElementById("continue-button");

const figuresIDs = ["semiquaver-duration-option",
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
      })
  });

/* let semiquaverFigure = document.getElementById("semiquaver-duration-option");
semiquaverFigure
  .addEventListener("click", () => {
    document.querySelector("figure[class='selected']").classList.remove("selected")
    semiquaverFigure.classList.add("selected")
  })

let quaverFigure = document.getElementById("quaver-duration-option");
quaverFigure
  .addEventListener("click", () => {
    document.querySelector("figure[class='selected']").classList.remove("selected")
    quaverFigure.classList.add("selected")
  })

let crotchetFigure = document.getElementById("crotchet-duration-option");
crotchetFigure
  .addEventListener("click", () => {
    document.querySelector("figure[class='selected']").classList.remove("selected")
    crotchetFigure.classList.add("selected")
  })

let minimFigure = document.getElementById("minim-duration-option");
minimFigure
  .addEventListener("click", () => {
    document.querySelector("figure[class='selected']").classList.remove("selected")
    minimFigure.classList.add("selected")
  })

let semibreveFigure = document.getElementById("semibreve-duration-option");
semibreveFigure
  .addEventListener("click", () => {
    document.querySelector("figure[class='selected']").classList.remove("selected")
    semibreveFigure.classList.add("selected")
  })
 */

//El botón cerrar en el modal de duración es equivalente a las crucecitas
document
  .getElementById("close-duration-modal-button")
  .addEventListener("click", () => {
    //Cerrar modal container
    document.getElementById("modal-background").classList.add("no-display");
    document.getElementById("chord-duration-modal").classList.add("no-display");
  });

  //Ambos botones tienen el mismo comportamiento, avanzar a Modal de Intervalos
[document.getElementById("go-to-intervals-modal-button"),
document.getElementById("continue-button")]
  .forEach(element =>
    element.addEventListener("click", () => {
      if (validateDuration()) {
        let chordDuration = document.getElementById("chord-duration-input").value;
        chord.duration = chordDuration;
        //Cerrar modal de duración
        document.getElementById("chord-duration-modal").classList.add("no-display");
        //Abrir modal de intervalos
        document.getElementById("chord-intervals-modal").classList.remove("no-display");
      }
    })
  );

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


