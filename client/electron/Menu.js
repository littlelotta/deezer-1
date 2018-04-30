const {
	app,
	dialog,
	shell
} = require('electron')
const Settings = require('./Settings')

module.exports = [{
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
				defaultPath: Settings.get('dlDir')
			})
			if (whereToSave !== undefined && Array.isArray(whereToSave))
				Settings.set('dlDir', whereToSave[0])
		}
	}]
}]