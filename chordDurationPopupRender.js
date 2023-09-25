const ipcRenderer = require("electron").ipcRenderer;


let chordDuration = document.getElementById("chordDurationInput");

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

document.querySelectorAll("#submitButton, #go-to-next-page-button")
.forEach(item => {
  item.addEventListener('click', event => {
    if (validate()) {
      ipcRenderer.send("receiveChordDuration", chordDuration.value);
    }
  })
})

document.getElementById("closeWindowButton")
.addEventListener("click", event =>{
  ipcRenderer.send("closeChordRequestWindow");
})

//Esta función se encarga de validar el campo de duración introducido manualmente por el usuario
//Desde aqui se muestran los mensajes de error
function validate() {
  let chordDurationValue = document.getElementById("chordDurationInput").value;
  if (Number.isNaN(chordDurationValue) || chordDurationValue <= 0) {
    document.querySelector(".error_text").style = "display:block";
    document.querySelector("#go-to-next-page-button").disabled = true;
    console.log("false")
    return false;
  } else {
    document.querySelector(".error_text").style = "display:none";
    document.querySelector("#go-to-next-page-button").disabled = false;
    console.log("true")
    return true;
  }
}


