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




