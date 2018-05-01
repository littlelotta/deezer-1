import * as request from 'request'
import { createWriteStream, accessSync, constants } from 'fs'
import { join } from 'path'
import * as ID3 from 'node-id3'
import { mkdirSync } from 'mkdir-recursive'

import { hex_md5 } from './md5'
import { Blowfish } from './blowfish'
import { ECB, util } from './aes'
import DZApi, { FILE_TYPES } from './deezer'

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

	private static writeTagsToMp3(track: any, file: string): Promise<void> {
		return new Promise(res => {
			DZApi.getTrackCover(track['ALB_PICTURE'])
				.then(buffer => ID3.update({
					TIT2: track['SNG_TITLE'],
					TPE1: track['ART_NAME'],
					TALB: track['ALB_TITLE'],
					APIC: buffer
				}, file, _ => { res() }))
		})
	}

	private static async writeTagsToFlac(track: any, file: string) {
	}

	private static writeDataToFile(data: Uint8Array, filename: string) {
		const wstream = createWriteStream(filename)
		wstream.write(data)
		wstream.end()
	}

	private static decryptTrack(data: any, key: number[]): Promise<Uint8Array> {
		return new Promise(res => {
			data = Uint8Array.from(data)
			var L = data.length
			for (var i = 0; i < L; i += 6144)
				if (i + 2048 <= L) {
					var D = data.slice(i, i + 2048)
					var bf = new Blowfish(key)
					bf.decryptCBC(D, [0, 1, 2, 3, 4, 5, 6, 7])
					data.set(D, i)
				}
			res(data)
		})
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

	public static async downloadTrack(track: any, fmt: FILE_TYPES, dir: string) {
		const url = 'https://e-cdns-proxy-' + track.MD5_ORIGIN.charAt(0) + '.dzcdn.net' + '/mobile/1/' + this.encryptURL(track, fmt)
		const key = this.bfGenKey(track.SNG_ID)

		const encryptedData = await this.downloadEncryptedTrack(url)
		const decryptedData = await this.decryptTrack(encryptedData, key)

		let ext: string
		let postAction: ((track: any, filename: string) => void)
		switch (fmt) {
			case FILE_TYPES.MP3_320:
				ext = 'mp3'
				postAction = this.writeTagsToMp3
				break;
			case FILE_TYPES.FLAC:
				ext = 'flac'
				postAction = this.writeTagsToFlac
				break;
			default:
				ext = 'mp3'
				postAction = this.writeTagsToMp3
				break;
		}

		try {
			mkdirSync(dir)
			accessSync(dir, constants.W_OK)
		} catch (e) {
			console.log('Can\'t write to directory')
			return false
		}
		const filename = join(dir, `${track.ART_NAME} - ${track.SNG_TITLE}.${ext}`)
		this.writeDataToFile(decryptedData, filename)
		await postAction(track, filename)

		return true
	}
}

process.on('message', async ({ json, fmt, path }) => {
	if (process.send !== undefined)
		process.send(await DZCrypt.downloadTrack(json, fmt, path))
})