import {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} from 'electron'
import * as path from 'path'
import * as url from 'url'

import DLF from './dlFolder'
import Settings from './Settings'
import DZApi, { FILE_TYPES } from '../deezer/deezer'

let api: DZApi

function getFileType(fmt: string) {
	switch (fmt) {
		case 'mp3':
			return FILE_TYPES.MP3_320
		case 'flac':
			return FILE_TYPES.FLAC
		default:
			return FILE_TYPES.MP3_320
	}
}

type IpcEvent = {
	sender: {
		send: (channel: string, data: any) => void
	}
}
ipcMain.on('API', async (event: IpcEvent, { action, payload }: { action: string, payload: any }) => {
	let ret = undefined
	switch (action) {

		case 'search':
			try {
				ret = await api.search(payload)
			} catch (e) {
				ret = []
			}
			break
		case 'dl':
			try {
				ret = await api.dlTrack(payload.id, getFileType(payload.fmt), Settings.get('dlDir'))
			} catch (e) {
				ret = false
			}
			break
	}
	event.sender.send('API', ret)
})

app.on('ready', async () => {

	Menu.setApplicationMenu(Menu.buildFromTemplate(require('./Menu')))

	if (Settings.get('dlDir') === undefined) Settings.set('dlDir', DLF())

	const pos = Settings.get('pos', [50, 50])
	const dim = Settings.get('dim', [450, 800])
	const win = new BrowserWindow({
		x: pos[0],
		y: pos[1],
		width: dim[0],
		height: dim[1],
		minWidth: 350,
		minHeight: 500,
		frame: false,
	})

	win.loadURL(url.format({
		pathname: path.join(__dirname, '../public/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	win.on('resize', () => {
		Settings.set('dim', win.getSize())
	})

	win.on('move', () => {
		Settings.set('pos', win.getPosition())
	})

	win.webContents.openDevTools()

	try {
		api = await DZApi.newAsync()
		console.log('API: Ready')
	} catch (e) {
		console.log('Could not initialize API')
		app.quit()
	}
})