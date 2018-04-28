const {
	app
} = require('electron')
const fs = require('fs')
const path = require('path')
const dlf = require('downloads-folder')

module.exports = class Settings {

	static getFileName() {
		return path.join(app.getPath('userData'), 'settings.json')
	}
	static write(obj) {
		fs.writeFileSync(
			this.getFileName(),
			JSON.stringify(
				Object.assign(this.read(), obj)
			)
		)
	}

	static read() {
		try {
			return JSON.parse(
				fs.readFileSync(
					this.getFileName()
				))
		} catch (e) {
			console.log('Error', e)
			return {}
		}
	}

	static getCurrentDownloadDir() {
		return this.read()['dlDir'] || dlf()
	}
}