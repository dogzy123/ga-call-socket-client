/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from 'electron';
import contextMenu from 'electron-context-menu';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import { setValue } from './settings';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

contextMenu({
  showInspectElement: false,
  showSearchWithGoogle: false,
});

let mainWindow: BrowserWindow | null = null;
let isQuiting: boolean = false;
let tray;

// utils
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

ipcMain.on('receive-call', async () => {
  mainWindow?.show();
  mainWindow?.focus();
  mainWindow?.flashFrame(true);
  mainWindow?.setAlwaysOnTop(true);

  const currentPos = mainWindow?.getPosition() || [0, 0];
  // make window shake to get user's attention with 10 shakes in 100ms
  for (let i = 0; i < 7; i++) {
    mainWindow?.setPosition(currentPos[0] + 10, currentPos[1]);
    await new Promise((resolve) => setTimeout(resolve, 150));
    mainWindow?.setPosition(currentPos[0] - 10, currentPos[1]);
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (i === 6) {
      mainWindow?.setAlwaysOnTop(false);
    }
  }
});

ipcMain.on('save-user-name', async (e, data) => {
  setValue('userName', data.name);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    center: true,
    fullscreenable: false,
    autoHideMenuBar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  Menu.setApplicationMenu(null);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', (event: any) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on('close', (event: any) => {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow?.hide();
      event.returnValue = false;
    }

    return false;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuiting = true;
});

app
  .whenReady()
  .then(() => {
    createWindow();

    tray = new Tray(getAssetPath('garena.png'));
    tray.setToolTip('Garena Alarm');
    tray.on('click', () => {
      mainWindow?.show();
    });

    const menu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow?.show();
        },
      },
      {
        label: 'Quit',
        click: () => {
          isQuiting = true;
          app.quit();
        },
      },
    ]);
    tray.setContextMenu(menu);

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
