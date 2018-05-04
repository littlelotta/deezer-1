import { app, dialog, shell } from 'electron'
import Settings from './Settings'
import { dirname } from 'path'
import { setNewDlFolder, resetApp } from './util'

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
		click: setNewDlFolder
	}, {
		label: 'Reset Settings',
		click: resetApp
	}, {
		label: 'Open Settings',
		click: () => {
			shell.openItem(dirname(Settings.getFileName()))
		}
	}]
}]