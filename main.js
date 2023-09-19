const { app, BrowserWindow, ipcMain, dialog } = require("electron");

let win = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    resizable: true,
    icon: "img/icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  win.loadFile("index.html");
});

//Inicializamos lista de acordes (por ahora tonos)
const chordList = [];

/* ipcMain.on("generarTono", (event, data) => {
win.webContents.send("recibirTono", data);
}); */

ipcMain.on("openRequestNoteCreationWindow", () => {
  //dialog.showErrorBox("HOla", "fua que error")
  requestChordDurationWin = new BrowserWindow({
    parent: win,
    //titleBarStyle: 'hidden',
    width: 300,
    height: 400,
    resizable: true,
    modal: true,
    minimizable: false,
    maximizable: false,
    roundedCorners: true,
    title: "Añadir nota",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  requestChordDurationWin.loadFile("chordDurationPopup.html");
})

/* ipcMain.on("saveThisArray", (event, array)=>{
  //Siempre guardamos al final
  chordList.push(array);
  console.log(array);
}) */

//Se invoca cuando desde el popup se obtiene el valor de duración del acorde
ipcMain.on("receiveChordDuration", (event, chordDuration) => {
  win.webContents.send('receiveChordDuration', chordDuration);
  requestChordDurationWin.loadFile("chordIntervalsPopup.html");
  //


/*   //Por último cerramos la ventana
  requestChordDurationWin.close(); */
})