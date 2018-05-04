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
	label: "Edit",
	submenu: [
		{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
		{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
		{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
		{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
	]
}]