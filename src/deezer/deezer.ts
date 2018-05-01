import * as Request from 'request'
import { fork } from 'child_process'
import { join } from 'path'

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

	constructor(public auth: AuthObject) { }

	public static async newAsync(): Promise<DZApi> {
		return new this(await AuthObject.getNewAuth())
	}

	private static getJSONAttr(from: string): string {
		switch (from) {
			case 'Track':
				return 'sng_id'
			case 'Album':
				return 'alb_id'
			default: return ''
		}
	}

	private getJSON(type: string, id: number): Promise<any> {
		return new Promise((resolve, reject) => {
			request({
				url: `https://www.deezer.com/ajax/gw-light.php?method=deezer.page${type}&input=3&api_version=1.0&api_token=${this.auth.token}`,
				method: 'POST',
				json: { [DZApi.getJSONAttr(type)]: id, "lang": "en", "tab": 0 }
			}, (err, res, body) => {
				if (Object.keys(body.results).length === 0) reject()
				resolve(body.results)
			})
		})
	}

	public search(q: string): Promise<any[]> {
		const categories = ['ALBUM', 'TRACK']
		const query: { 'QUERY': string, 'TYPES': { [prop: string]: boolean }, 'NB': number } = {
			'QUERY': q,
			'TYPES': {},
			'NB': 25
		}
		for (const cat of categories) query['TYPES'][cat] = true

		return new Promise((resolve, reject) => {
			if (q == '') return []
			request({
				url: `https://www.deezer.com/ajax/gw-light.php?method=deezer.suggest&input=3&api_version=1.0&api_token=${this.auth.token}`,
				method: 'POST',
				json: query
			}, (err, res, body) => {
				if (Object.keys(body.results).length === 0) resolve([])

				let ret: any[] = []
				for (const cat of categories) ret = ret.concat(body.results[cat])
				resolve(ret)
			})
		})
	}

	public dlTrack(id: number, fmt = FILE_TYPES.MP3_320, path: string): Promise<boolean> {
		return new Promise(res => {
			const compute = fork(__dirname + '/crypt.js')
			this.getJSON('Track', id).then(json => compute.send({ json: json.DATA, fmt, path }))
			compute.on('message', (success: boolean) => {
				res(success)
			})
		})
	}

	public dlAlbum(id: number, fmt = FILE_TYPES.MP3_320, path: string): Promise<boolean> {
		return new Promise(res => {
			this.getJSON('Album', id).then(json => {
				const newPath = join(path, json.DATA.ALB_TITLE)
				const allTracks: Promise<boolean>[] = []
				for (const track of json.SONGS.data)
					allTracks.push(this.dlTrack(track.SNG_ID, fmt, newPath))
				Promise.all(allTracks).then(_ => { res(json) })
			})
		})
	}

	public static getTrackCover(id: string, size = 1500): Promise<Buffer> {
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