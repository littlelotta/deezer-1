import { app } from 'electron'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

type Setting = { [setting: string]: string }

export default class Settings {

	public static getFileName(): string {
		return join(app.getPath('userData'), 'settings.json')
	}

	private static writeOverwrite(obj: Setting) {
		writeFileSync(this.getFileName(), JSON.stringify(obj))
	}

	private static write(obj: Setting) {
		this.writeOverwrite(Object.assign(this.read(), obj))
	}

	private static read() {
		try {
			return JSON.parse(readFileSync(this.getFileName()).toString())
		} catch (e) {
			return {}
		}
	}

	public static get(attr: string, init?: any) {
		let val = init
		const cur = this.read()[attr]
		if (cur !== undefined)
			val = cur
		return val
	}

	public static set(attr: string, val: any) {
		this.write({
			[attr]: val
		})
	}

	public static reset() {
		this.writeOverwrite({})
	}

}