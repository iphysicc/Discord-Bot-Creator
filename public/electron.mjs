import { app, BrowserWindow, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "out"),
    })
  : null;

const createWindows = () => {
  const preloadPath = path.join(__dirname, "preload.js");
  console.log("Preload script path:", preloadPath);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      openDevTools: true
    }
  });

  // Set Content Security Policy (CSP) headers
  // mainWindow.webContents.session.webRequest.onHeadersReceived(
  //   { urls: ["*://*/*"] },
  //   (details, callback) => {
  //     const headers = Object.assign({}, details.responseHeaders);
  //     headers["Content-Security-Policy"] = [
  //       "default-src 'self' https:; script-src 'self' https:; style-src 'self' https: 'unsafe-inline';",
  //     ];
  //     callback({ cancel: false, responseHeaders: headers });
  //   }
  // );

  if (app.isPackaged) {
    appServe(mainWindow).then(() => {
      mainWindow.loadURL("app://-");
    });
  } else {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-fail-load", (e, code, desc) => {
      mainWindow.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  createWindows();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});