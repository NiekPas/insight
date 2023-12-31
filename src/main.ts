import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import * as path from "path";
import { handleAnalyzeFile } from "./python-bridge";
import TextProcessingOptions from "./types/TextProcessingOptions";

function createWindow() {
  // Create the browser window.
  const options = windowOptionsForEnvironment(process.env.NODE_ENV);
  const mainWindow = new BrowserWindow(options);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('analyze-file', (e: IpcMainInvokeEvent, path: string, options: TextProcessingOptions) => handleAnalyzeFile(path, options));
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

function windowOptionsForEnvironment(node_env: string): Electron.BrowserWindowConstructorOptions {
  if (node_env = 'development') {
    return {
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      // Extra wide for devtools
      width: 1200,
    };
  }
  return {
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  };
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
