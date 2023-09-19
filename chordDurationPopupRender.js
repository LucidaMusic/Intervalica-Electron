const ipcRenderer = require("electron").ipcRenderer;


var freqInput = document.getElementById("freqInput");

//Adding action on Enter key
freqInput.addEventListener("keydown", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("submitButton").click();
    }
})

//Once we have the desired chord duration, we return to main to inform main render
const informChordDuration = () => {
    ipcRenderer.send("receiveChordDuration", freqInput.value)
}
