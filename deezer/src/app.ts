import * as Request from 'request'
import { writeFileSync, createWriteStream } from 'fs'
import { IncomingMessage } from 'http'
import * as ID3 from 'node-id3'

import { hex_md5 } from './md5'
import { Blowfish } from './blowfish'
import { ECB, util } from './aes'

const request = Request.defaults({
	jar: Request.jar(),
	headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' }
})

enum FILE_TYPES {
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

class DZCrypt {

	private static bfGK = 'g4el58wc0zvf9na1'
	private static urlCryptor = new ECB(util.convertStringToBytes('jo6aey6haid2Teih'))

	private static bfGenKey2(h1: string, h2: string): number[] {
		var l = h1.length,
			s = []
		for (var i = 0; i < l; i++) s.push(this.bfGK.charCodeAt(i) ^ h1.charCodeAt(i) ^ h2.charCodeAt(i))
		return s
	}

	private static bfGenKey(id: string): number[] {
		var h = hex_md5(id + '')
		var h1 = h.substr(0, 16),
			h2 = h.substr(16, 16)
		var k = this.bfGenKey2(h1, h2)
		return k
	}

	private static zeroPad(b: string) {
		const aesBS = 16;
		var l = b.length;
		if (l % aesBS != 0) {
			b += '\0'.repeat(aesBS - (l % aesBS));
		}
		return b;
	};

	private static encryptURL(track: any, fmt: FILE_TYPES) {
		const urlsep = '\xa4'
		var str = [track.MD5_ORIGIN, fmt, track.SNG_ID, track.MEDIA_VERSION].join(urlsep);
		str = this.zeroPad([hex_md5(str), str, ''].join(urlsep));
		const encrypted = util.convertBytesToString(this.urlCryptor.encrypt(
			str.split('').map(c => c.charCodeAt(0))
		), 'hex')
		return encrypted
	}

	private static async writeTagsToFile(track: any, file: string) {
		ID3.update({
			TIT2: track['SNG_TITLE'],
			TPE1: track['ART_NAME'],
			TALB: track['ALB_TITLE'],
			APIC: await DZApi.getTrackCover(track['ALB_PICTURE'])
		}, file, (_: any) => { })
	}

	public static async downloadTrack(track: any, fmt = FILE_TYPES.MP3_320) {
		const url = 'https://e-cdns-proxy-' + track.MD5_ORIGIN.charAt(0) + '.dzcdn.net' + '/mobile/1/' + this.encryptURL(track, fmt)
		const key = this.bfGenKey(track.SNG_ID)

		const encryptedData = await this.downloadEncryptedTrack(url)
		const decryptedData = this.decryptTrack(encryptedData, key)

		const filename = `${track.SNG_TITLE}.mp3`
		this.writeDataToFile(decryptedData, filename)
		await this.writeTagsToFile(track, filename)

		return true
	}

	private static writeDataToFile(data: Uint8Array, filename: string) {
		const wstream = createWriteStream(filename)
		wstream.write(data)
		wstream.end()
	}

	private static decryptTrack(data: any, key: number[]) {
		data = Uint8Array.from(data)
		var L = data.length
		for (var i = 0; i < L; i += 6144)
			if (i + 2048 <= L) {
				var D = data.slice(i, i + 2048)
				var bf = new Blowfish(key)
				bf.decryptCBC(D, [0, 1, 2, 3, 4, 5, 6, 7])
				data.set(D, i)
			}
		return data
	}

	private static downloadEncryptedTrack(url: string): Promise<any> {
		return new Promise<string>(resolve => {
			request({
				url: url,
				method: 'get',
				encoding: null
			}, (err, httpsResponse, body) => {
				resolve(body)
			})
		})
	}
}

class DZApi {

	constructor(public auth: AuthObject) { }

	search(q: string): Promise<any[]> {
		const query = {
			'QUERY': q,
			'TYPES': {
				'ARTIST': false,
				'ALBUM': false,
				'TRACK': true,
				'PLAYLIST': false,
				'RADIO': false,
				'SHOW': false,
				'TAG': false,
				'USER': false,
				'CHANNEL': false,
				'LIVESTREAM': false
			},
			// 'NB': 3
		}
		return new Promise((resolve, reject) => {
			request({
				url: `https://www.deezer.com/ajax/gw-light.php?method=deezer.suggest&input=3&api_version=1.0&api_token=${this.auth.token}`,
				method: 'POST',
				json: query
			}, (err, res, body) => {
				if (Object.keys(body.results).length === 0) reject('Bad request')
				resolve(body.results.TRACK)
			})
		})
	}

	getTrackJSON(id: string | number): Promise<JSON> {
		return new Promise((resolve, reject) => {
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

async function entry() {
	try {
		const auth = await AuthObject.getNewAuth()
		const api = new DZApi(auth)

		const search = await api.search('Nobody A little')
		const info = await api.getTrackJSON(search[0]['SNG_ID'])
		const ret = await DZCrypt.downloadTrack(info)
	} catch (err) {
		console.log(err)
	}
}

entry()