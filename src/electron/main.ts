import {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} from 'electron'
import * as path from 'path'
import * as url from 'url'

import { setNewDlFolder, resetApp } from './util'
import DLF from './dlFolder'
import Settings from './Settings'
import DZApi, { FILE_TYPES } from '../deezer/deezer'
import * as Spotify from '../spotify/spotify'

let api: DZApi
let sapi: Spotify.API

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
ipcMain.on('Deezer', async (event: IpcEvent, { action, payload }: { action: string, payload: any }) => {
	let ret: any = false
	switch (action) {

		case 'search':
			try {
				ret = await api.search(payload)
			} catch (e) {
				ret = []
			}
			break
		case 'dl:song':
			try {
				await api.dlTrack(payload.id, getFileType(payload.fmt), Settings.get('dlDir'))
				ret = payload.id
			} catch (e) {
				ret = false
			}
			break
		case 'dl:album':
			try {
				if (await api.dlAlbum(payload.id, getFileType(payload.fmt), Settings.get('dlDir'))) ret = payload.id
				else throw new Error()
			} catch (e) {
				ret = false
			}
			break
		case 'dl:s:playlist':
			ret = payload.id
			break
		case 'dl:s:track':
			try {
				const equiv = await api.getDeezerEquivalent(payload.id.join(' '), 'TRACK')
				await api.dlTrack(equiv.SNG_ID, getFileType(payload.fmt), Settings.get('dlDir'))
				ret = payload.id
			} catch (e) {
				ret = false
			}
	}
	event.sender.send('Deezer', ret)
})

ipcMain.on('Spotify', async (event: IpcEvent, { action, payload }: { action: string, payload: any }) => {
	let ret: any = false
	switch (action) {

		case 'do:login':
			sapi = new Spotify.API(await Spotify.Auth.login())
			ret = await sapi.getOwnProfile()
			break
		case 'do:logout':
			Settings.set('spotifyActivated', false)
			ret = true
			break
		case 'get:own:playlists':
			ret = await sapi.getOwnPlaylists()
			break
		case 'get:playlist':
			ret = await sapi.getLink(payload.link)
			break
		case 'get:iterable':
			ret = await sapi.getIterable(payload.iterable)
			break
	}
	event.sender.send('Spotify', ret)
})

ipcMain.on('Settings', async (event: IpcEvent, { action, payload }: { action: string, payload: any }) => {
	let ret: any = false
	switch (action) {
		case 'get':
			ret = Settings.read()
			break
		case 'set:dlFolder':
			ret = setNewDlFolder()
			break
		case 'do:reset':
			ret = resetApp()
			break
	}
	event.sender.send('Settings', ret)
})

app.on('ready', async () => {

	Menu.setApplicationMenu(Menu.buildFromTemplate(require('./Menu')))

	if (Settings.get('dlDir') === undefined) Settings.set('dlDir', DLF())
	if (Settings.get('spotifyActivated') === undefined) Settings.set('spotifyActivated', false)

	const pos = Settings.get('pos', [50, 50])
	const dim = Settings.get('dim', [450, 800])
	const win = new BrowserWindow({
		x: pos[0],
		y: pos[1],
		width: dim[0],
		height: dim[1],
		minWidth: 550,
		minHeight: 650,
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