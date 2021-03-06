import {
	app,
	Menu,
	shell,
	BrowserWindow,
	MenuItemConstructorOptions,
	dialog,
} from 'electron';
import fs from 'fs';
import path from 'path';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
	selector?: string;
	submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

type Data = {
	title: string;
	text: string;
};

export default class MenuBuilder {
	mainWindow: BrowserWindow;
	private data?: Data;
	private save?: boolean;

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
	}

	sendData(save?: boolean, data?: Data) {
		this.data = data;
		this.save = save;
	}

	private saveFile() {
		const absolutePath = dialog.showSaveDialogSync({
			defaultPath: this.data?.title,
			filters: [
				{
					name: 'Text Documents (*.txt)',
					extensions: ['txt', 'text'],
				},
			],
		});

		if (absolutePath && this.data?.text) {
			fs.writeFile(absolutePath, this.data.text, (err) => {
				if (err) throw err;

				this.mainWindow.webContents.send('SAVED', true);

				this.save = true;
			});
		}
	}

	buildMenu(): Menu {
		if (
			process.env.NODE_ENV === 'development' ||
			process.env.DEBUG_PROD === 'true'
		) {
			this.setupDevelopmentEnvironment();
		}

		const template =
			process.platform === 'darwin'
				? this.buildDarwinTemplate()
				: this.buildDefaultTemplate();

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);

		return menu;
	}

	setupDevelopmentEnvironment(): void {
		this.mainWindow.webContents.on('context-menu', (_, props) => {
			const { x, y } = props;

			Menu.buildFromTemplate([
				{
					label: 'Inspect element',
					click: () => {
						this.mainWindow.webContents.inspectElement(x, y);
					},
				},
			]).popup({ window: this.mainWindow });
		});
	}

	buildDarwinTemplate(): MenuItemConstructorOptions[] {
		const subMenuAbout: DarwinMenuItemConstructorOptions = {
			label: 'Electron',
			submenu: [
				{
					label: 'About ElectronReact',
					selector: 'orderFrontStandardAboutPanel:',
				},
				{ type: 'separator' },
				{ label: 'Services', submenu: [] },
				{ type: 'separator' },
				{
					label: 'Hide ElectronReact',
					accelerator: 'Command+H',
					selector: 'hide:',
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Shift+H',
					selector: 'hideOtherApplications:',
				},
				{ label: 'Show All', selector: 'unhideAllApplications:' },
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: () => {
						app.quit();
					},
				},
			],
		};
		const subMenuEdit: DarwinMenuItemConstructorOptions = {
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
				{
					label: 'Redo',
					accelerator: 'Shift+Command+Z',
					selector: 'redo:',
				},
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
				{ label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
				{
					label: 'Paste',
					accelerator: 'Command+V',
					selector: 'paste:',
				},
				{
					label: 'Select All',
					accelerator: 'Command+A',
					selector: 'selectAll:',
				},
			],
		};
		const subMenuViewDev: MenuItemConstructorOptions = {
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'Command+R',
					click: () => {
						this.mainWindow.webContents.reload();
					},
				},
				{
					label: 'Toggle Full Screen',
					accelerator: 'Ctrl+Command+F',
					click: () => {
						this.mainWindow.setFullScreen(
							!this.mainWindow.isFullScreen()
						);
					},
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: 'Alt+Command+I',
					click: () => {
						this.mainWindow.webContents.toggleDevTools();
					},
				},
			],
		};
		const subMenuViewProd: MenuItemConstructorOptions = {
			label: 'View',
			submenu: [
				{
					label: 'Toggle Full Screen',
					accelerator: 'Ctrl+Command+F',
					click: () => {
						this.mainWindow.setFullScreen(
							!this.mainWindow.isFullScreen()
						);
					},
				},
			],
		};
		const subMenuWindow: DarwinMenuItemConstructorOptions = {
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Command+M',
					selector: 'performMiniaturize:',
				},
				{
					label: 'Close',
					accelerator: 'Command+W',
					selector: 'performClose:',
				},
				{ type: 'separator' },
				{ label: 'Bring All to Front', selector: 'arrangeInFront:' },
			],
		};
		const subMenuHelp: MenuItemConstructorOptions = {
			label: 'Help',
			submenu: [
				{
					label: 'Learn More',
					click() {
						shell.openExternal('https://electronjs.org');
					},
				},
				{
					label: 'Documentation',
					click() {
						shell.openExternal(
							'https://github.com/electron/electron/tree/master/docs#readme'
						);
					},
				},
				{
					label: 'Community Discussions',
					click() {
						shell.openExternal(
							'https://www.electronjs.org/community'
						);
					},
				},
				{
					label: 'Search Issues',
					click() {
						shell.openExternal(
							'https://github.com/electron/electron/issues'
						);
					},
				},
			],
		};

		const subMenuView =
			process.env.NODE_ENV === 'development' ||
			process.env.DEBUG_PROD === 'true'
				? subMenuViewDev
				: subMenuViewProd;

		return [
			subMenuAbout,
			subMenuEdit,
			subMenuView,
			subMenuWindow,
			subMenuHelp,
		];
	}

	buildDefaultTemplate() {
		const templateDefault = [
			{
				label: '&File',
				submenu: [
					{
						label: '&Save',
						accelerator: 'Ctrl+S',
						visible: this.data !== undefined,
						enabled: this.save !== undefined ? !this.save : false,
						click: () => {
							this.saveFile();
						},
					},
					{
						label: '&Open',
						accelerator: 'Ctrl+O',
						click: () => {
							const absolutePath = dialog.showOpenDialogSync({
								filters: [
									{
										name: 'Video',
										extensions: ['mkv', 'avi', 'mp4'],
									},
								],
							});

							if (absolutePath) {
								this.mainWindow.webContents.send('OPEN', {
									title: path.basename(
										absolutePath[0],
										path.extname(absolutePath[0])
									),
									path: absolutePath[0],
								});
							}
						},
					},
					{
						label: '&Close',
						accelerator: 'Ctrl+W',
						click: () => {
							if (this.save !== undefined) {
								if (!this.save) {
									const index = dialog.showMessageBoxSync({
										type: 'warning',
										message:
											"You haven't saved your changes.",
										detail:
											'Would you like to save them now?',
										buttons: ['Yes', 'No', 'Cancel'],
									});

									if (index === 0) {
										this.saveFile();
									} else if (index === 2) {
										return;
									}
								}
							}

							this.mainWindow.close();
						},
					},
				],
			},
			{
				label: '&View',
				submenu:
					process.env.NODE_ENV === 'development' ||
					process.env.DEBUG_PROD === 'true'
						? [
								{
									label: '&Reload',
									accelerator: 'Ctrl+R',
									click: () => {
										this.mainWindow.webContents.reload();
									},
								},
								{
									label: 'Toggle &Full Screen',
									accelerator: 'F11',
									click: () => {
										this.mainWindow.setFullScreen(
											!this.mainWindow.isFullScreen()
										);
									},
								},
								{
									label: 'Toggle &Developer Tools',
									accelerator: 'Alt+Ctrl+I',
									click: () => {
										this.mainWindow.webContents.toggleDevTools();
									},
								},
						  ]
						: [
								{
									label: 'Toggle &Full Screen',
									accelerator: 'F11',
									click: () => {
										this.mainWindow.setFullScreen(
											!this.mainWindow.isFullScreen()
										);
									},
								},
						  ],
			},
		];

		return templateDefault;
	}
}
