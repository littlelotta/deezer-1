import { app } from 'electron'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

type Setting = { [setting: string]: string }

export default class Settings {

	private static getFileName(): string {
		return join(app.getPath('userData'), 'settings.json')
	}

	private static write(obj: Setting) {
		writeFileSync(
			this.getFileName(),
			JSON.stringify(
				Object.assign(this.read(), obj)
			)
		)
	}

	private static read() {
		try {
			return JSON.parse(readFileSync(this.getFileName()).toString())
		} catch (e) {
			return {}
		}
	}

	static get(attr: string, init?: any) {
		let val = init
		const cur = this.read()[attr]
		if (cur !== undefined)
			val = cur
		return val
	}

	static set(attr: string, val: any) {
		this.write({
			[attr]: val
		})
	}
}