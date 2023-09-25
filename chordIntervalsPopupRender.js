const ipcRenderer = require("electron").ipcRenderer;

document
    .getElementById("goToPreviousPage_button")
    .addEventListener("click", () => {
        ipcRenderer.send("goToChordDurationPopup");
    });
document
    .getElementById("goTONextPage_button")
    .addEventListener("click", () => {
        ipcRenderer.send("goToChordDurationPopup");
    });