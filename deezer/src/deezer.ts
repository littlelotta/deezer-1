import * as Request from 'request'
import { fork } from 'child_process'

const request = Request.defaults({
	jar: Request.jar(),
	headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' }
})

export enum FILE_TYPES {
	MP3_256 = 1,
	MP3_320 = 3,
	FLAC = 9,
}

class AuthObject {
	static rexp = /checkForm ?= ?(\"|\').{32}\1/g

	// constructor(public token: string, public sid: string) { }
	constructor(public token: string) { }

	private static extractTokenFromHtml(html: string): string {
		const tkn = this.rexp.exec(html)
		if (tkn !== null)
			return tkn[0].slice(13, -1)
		return ''
	}

	static async getNewAuth(): Promise<AuthObject> {

		await new Promise(resolve => {
			request({
				url: 'https://www.deezer.com/ajax/action.php',
				method: 'post',
				form: {
					type: 'login',
					mail: 'tibegestep@hu4ht.com',
					password: 'tibegestep@hu4ht.com',
				}
			}, (err, res, body) => {
				if (body !== 'success') throw new Error('Could not log in')
				resolve()
			})
		})

		const tknBody: string = await new Promise<string>(resolve => {
			request({
				url: 'https://www.deezer.com/en/',
				method: 'get'
			}, (err, httpsResponse, body) => {
				resolve(body)
			})
		})

		return new this(this.extractTokenFromHtml(tknBody))
	}
}

export default class DZApi {

	public static async newAsync(): Promise<DZApi> {
		return new this(await AuthObject.getNewAuth())
	}

	constructor(public auth: AuthObject) { }

	public search(q: string): Promise<any[]> {
		const query = {
			'QUERY': q,
			'TYPES': {
				'ARTIST': false,
				'ALBUM': true,
				'TRACK': false,
				'PLAYLIST': false,
				'RADIO': false,
				'SHOW': false,
				'TAG': false,
				'USER': false,
				'CHANNEL': false,
				'LIVESTREAM': false
			},
			'NB': 25
		}
		return new Promise((resolve, reject) => {
			if (q == '') return []
			request({
				url: `https://www.deezer.com/ajax/gw-light.php?method=deezer.suggest&input=3&api_version=1.0&api_token=${this.auth.token}`,
				method: 'POST',
				json: query
			}, (err, res, body) => {
				if (Object.keys(body.results).length === 0) resolve([])
				resolve(body.results.TRACK)
			})
		})
	}

	public dlTrack(id: number, fmt = FILE_TYPES.MP3_320, path: string): Promise<boolean> {
		return new Promise(res => {
			const compute = fork(__dirname + '/crypt.js')
			this.getTrackJSON(id).then(json => compute.send({ json, fmt, path }))
			compute.on('message', (success: boolean) => {
				res(success)
			})
		})
	}

	getTrackJSON(id: string | number): Promise<JSON> {
		return new Promise((resolve, reject) => {
			if (id == '') return []
			request({
				url: `https://www.deezer.com/ajax/gw-light.php?method=deezer.pageTrack&input=3&api_version=1.0&api_token=${this.auth.token}`,
				method: 'POST',
				json: { "sng_id": id, "lang": "en", "tab": 0 }
			}, (err, res, body) => {
				if (Object.keys(body.results).length === 0) reject('Bad request')
				resolve(body.results.DATA)
			})
		})
	}

	static getTrackCover(id: string, size = 1500): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			request({
				url: `https://e-cdns-images.dzcdn.net/images/cover/${id}/${size}x${size}.jpg`,
				method: 'get',
				encoding: null,
			}, (err, res, body) => {
				resolve(Buffer.from(body))
			})
		})
	}
}