import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { PythonShell } from 'python-shell';
import * as fs from "fs";

// Define the file path in /tmp directory
const logPath = path.join('/tmp', 'electronpython-err.log');
const scriptPath = path.join(process.resourcesPath, 'script.py');

async function handleRunPythonCode(): Promise<void> {
  const options = { args: ['bla bla bla'] };

  PythonShell.run(scriptPath, options).then((messages: [string]) => {
    console.log(messages);
    // Do something with messages here
  }).catch((err: any) => {
    // TODO error handling
    fs.writeFileSync(logPath, err.toString());
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('run-python-code', handleRunPythonCode);
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
