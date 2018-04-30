const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = require('electron')
const path = require('path')
const url = require('url')
const dlf = require('downloads-folder')

const Settings = require('./Settings')

const DZApi = require('../../deezer/dist/deezer').default
const FILE_TYPES = require('../../deezer/dist/deezer').FILE_TYPES

let api

function getFileType(fmt) {
	switch (fmt) {
		case 'mp3':
			return FILE_TYPES.MP3_320
		case 'flac':
			return FILE_TYPES.FLAC
		default:
			return FILE_TYPES.MP3_320
	}
}

ipcMain.on('API', async (event, {
	action,
	payload
}) => {
	let ret = undefined
	switch (action) {

		case 'search':
			ret = await api.search(payload)
			break

		case 'dl':
			ret = await api.dlTrack(payload.id, getFileType(payload.fmt), Settings.get('dlDir'))
			break
	}
	event.sender.send('API', ret)
})

app.on('ready', async () => {

	Menu.setApplicationMenu(Menu.buildFromTemplate(require('./Menu')))

	if (Settings.get('dlDir'), false) Settings.set('dlDir', dlf())

	const pos = Settings.get('pos', [50, 50])
	const dim = Settings.get('dim', [450, 800])
	win = new BrowserWindow({
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

	win.toggleDevTools()

	win.on('closed', () => {
		win = null
	})

	try {
		api = await DZApi.newAsync()
	} catch (e) {
		console.log('Could not initialize API')
		app.quit()
	}
})