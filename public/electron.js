
const isDev = require("electron-is-dev");
const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
      enableRemoteModule: true,
      // nodeIntegration: true,
    }
  })

  if(isDev) mainWindow.loadURL("http://localhost:3000");
  else mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

