import * as https from 'https'
import * as Request from 'request'
import { IncomingMessage } from 'http'
import { writeFileSync } from 'fs'
import { hex_md5 } from './md5'
import * as aesjs from './aes'
import { reject } from 'bluebird';

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
	private static urlCryptor = new aesjs.ModeOfOperation.ecb(aesjs.util.convertStringToBytes('jo6aey6haid2Teih'))

	private static bfGenKey2(h1: string, h2: string): number[] {
		var l = h1.length,
			s = []
		for (var i = 0; i < l; i++) s.push(this.bfGK.charCodeAt(i) ^ h1.charCodeAt(i) ^ h2.charCodeAt(i))
		return s
	}

	private static bfGenKey(id: string, format: string): number[] | string {
		var h = hex_md5(id + '')
		var h1 = h.substr(0, 16),
			h2 = h.substr(16, 16)
		var k = this.bfGenKey2(h1, h2)
		if (!format) return k
		return k.map(format == 'hex' ? ((a: number) => (a + 256).toString(16).substr(-2)) : ((a: number) => String.fromCharCode(a))).join('')
	}

	private static zeroPad(b) {
		const aesBS = 16;
		var l = b.length;
		if (l % aesBS != 0) {
			if (typeof (b) === 'string') b += '\0'.repeat(aesBS - (l % aesBS));
			else b = b.concat(Array.apply(null, Array(aesBS - (l % aesBS))).map(() => 0));
		}
		return b;
	};

	private static str2bin(s: string) {
		return s.split('').map(c => c.charCodeAt(0));
	}

	private static bin2hex(b) {
		return aesjs.util.convertBytesToString(b, 'hex');
	}

	private static encryptURL(track, fmt: FILE_TYPES) {
		const urlsep = '\xa4'
		var str = [track.MD5_ORIGIN, fmt, track.SNG_ID, track.MEDIA_VERSION].join(urlsep);
		str = this.zeroPad([hex_md5(str), str, ''].join(urlsep));
		return this.bin2hex(this.urlCryptor.encrypt(this.str2bin(str)));
	}

	static dzDownload(track, fmt = FILE_TYPES.MP3_320) {
		var msg = [
			'https://e-cdns-proxy-' + track.MD5_ORIGIN.charAt(0) + '.dzcdn.net' + '/mobile/1/' + this.encryptURL(track, fmt),
			this.bfGenKey(track.SNG_ID, '')
		]
		console.log(msg)
		// mainWk.postMessage(msg)
	}
}

class DZApi {

	constructor(public auth: AuthObject) { }

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
}

async function entry() {
	try {
		const auth = await AuthObject.getNewAuth()
		const api = new DZApi(auth)

		const info = await api.getTrackJSON(367505291)
		DZCrypt.dzDownload(info)
	} catch (err) {
		console.log(err)
	}
}

entry()