import { app, dialog } from 'electron'
import Settings from './Settings'

export function setNewDlFolder() {
	const whereToSave = dialog.showOpenDialog({
		properties: ['openDirectory'],
		defaultPath: Settings.get('dlDir')
	})
	if (whereToSave !== undefined && Array.isArray(whereToSave))
		Settings.set('dlDir', whereToSave[0])
	return true
}

export function resetApp() {
	Settings.reset()
	app.quit()
	return true
}