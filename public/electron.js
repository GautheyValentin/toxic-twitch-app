const isDev = require('electron-is-dev');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
      enableRemoteModule: true,
      plugins: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
    resizable: true,
    show: false,
    icon: __dirname + '/favicon.ico',
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) mainWindow.loadURL('http://localhost:3000');
  else
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

ipcMain.on('window-event', (event, trigger) => {
  if (trigger === 'window-close') app.quit();
  else if ('window-minimize') mainWindow.minimize();
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
