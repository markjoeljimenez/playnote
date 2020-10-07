/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';

import MenuBuilder from './window/menu';

export default class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

if (
	process.env.NODE_ENV === 'development' ||
	process.env.DEBUG_PROD === 'true'
) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map((name) =>
			installer.default(installer[name], forceDownload)
		)
	).catch(console.log);
};

const createWindow = async () => {
	if (
		process.env.NODE_ENV === 'development' ||
		process.env.DEBUG_PROD === 'true'
	) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'resources')
		: path.join(__dirname, '../resources');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath('icon.png'),
		webPreferences:
			(process.env.NODE_ENV === 'development' ||
				process.env.E2E_BUILD === 'true') &&
			process.env.ERB_SECURE !== 'true'
				? {
						nodeIntegration: true,
				  }
				: {
						preload: path.join(__dirname, 'dist/renderer.prod.js'),
				  },
	});

	mainWindow.loadURL(`file://${__dirname}/app.html`);

	// @TODO: Use 'ready-to-show' event
	//        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
	mainWindow.webContents.on('did-finish-load', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
			mainWindow.focus();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	const CHANNEL_NAME = 'main';

	/**
	 * Add an IPC event listener for the channel
	 */
	ipcMain.on(CHANNEL_NAME, (event, data) => {
		/** Show the request data */
		menuBuilder.sendData(data);
	});

	ipcMain.on('GET_NOTES', (event, data) => {
		const file = data.path.replace(/\.[^/.]+$/, '.txt');

		try {
			if (fs.existsSync(file)) {
				const text = fs
					.readFileSync(file, 'UTF-8')
					.toString()
					.split('\n')
					.filter((s) => s !== '');

				event.returnValue = text;
				return;
			}
		} catch (err) {
			console.error(err);
		}

		event.returnValue = null;
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

if (process.env.E2E_BUILD === 'true') {
	// eslint-disable-next-line promise/catch-or-return
	app.whenReady().then(createWindow);
} else {
	app.on('ready', createWindow);
}

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow();
});

// const test = (data) => {
// 	const path = dialog.showSaveDialogSync({});

// 	console.log(this.data);

// 	if (path && this.data) {
// 		fs.writeFile(path, this.data, (err) => {
// 			if (err) throw err;
// 		});
// 	}
// },
// };
