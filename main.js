const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    resizable: true,
    icon: "img/icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  mainWindow.maximize();
  mainWindow.loadFile("index.html");
});

/* ipcMain.on("generarTono", (event, data) => {
win.webContents.send("recibirTono", data);
}); */

/* let chordRequestPopupWindow;

ipcMain.on("openRequestNoteCreationWindow", () => {
  chordRequestPopupWindow = new BrowserWindow({
    parent: mainWindow,
    resizable: true, //Solo por tema debugging
    width: 300,
    height: 400,
    modal: true,
    minimizable: false,
    maximizable: false,
    roundedCorners: true,
    title: "Añadir acorde",
    //frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  //chordRequestPopupWindow.setMenu(null);
  chordRequestPopupWindow.loadFile("chordDurationPopup.html");
}) */

/* ipcMain.on("saveThisArray", (event, array)=>{
  //Siempre guardamos al final
  chordList.push(array);
  console.log(array);
}) */

//Se invoca cuando desde el popup se obtiene el valor de duración del acorde
/* ipcMain.on("receiveChordDuration", (event, chordDuration) => {
  mainWindow.webContents.send('receiveChordDuration', chordDuration);
  chordRequestPopupWindow.loadFile("chordIntervalsPopup.html");
  //


  /*   //Por último cerramos la ventana
    requestChordDurationWin.close(); 
});

ipcMain.on("closeChordRequestWindow", () => {
  chordRequestPopupWindow.close();
});

ipcMain.on("goToChordDurationPopup", () => {
  chordRequestPopupWindow.loadFile("chordDurationPopup.html");
}) */