import { app, dialog, shell } from 'electron'
import Settings from './Settings'
import { dirname } from 'path'

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
		accelerator: 'CmdOrCtrl+Q',
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
	}, {
		label: 'Reset Settings',
		click: () => {
			Settings.reset()
			app.quit()
		}
	}, {
		label: 'Open Settings',
		click: () => {
			shell.openItem(dirname(Settings.getFileName()))
		}
	}]
}]