const {
	app,
	BrowserWindow,
	Menu,
	shell,
	dialog
} = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')

const Settings = require('./src/Settings')

const menuTemplate = [{
	label: 'Deezer Downloader',
	submenu: [{
		label: 'About...',
		click: () => {
			shell.openExternal('https://github.com/CupCakeArmy/deezer')
		}
	}, {
		type: 'separator'
	}, {
		label: 'Quit',
		click: app.quit
	}]
}, {
	label: 'Options',
	submenu: [{
		label: 'Select download folder',
		click: () => {
			const whereToSave = dialog.showOpenDialog({
				properties: ['openDirectory'],
				defaultPath: Settings.getCurrentDownloadDir()
			})[0]
			Settings.write({
				dlDir: whereToSave
			})
		}
	}]
}]

app.on('ready', () => {
	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
	win = new BrowserWindow({
		width: 450,
		height: 800,
		minWidth: 350,
		minHeight: 500,
		frame: false,
	})

	win.loadURL(url.format({
		pathname: path.join(__dirname, '../client/public/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	win.on('closed', () => {
		win = null
	})

	console.log(Settings.read())
})