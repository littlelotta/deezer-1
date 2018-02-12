import * as https from 'https'

interface Options {
	hostname: string
	method: string
	port?: number
	path?: string
	body?: any
}

class DZApi {

	static rexp = /checkForm ?= ?(\"|\')(\w|\.|~|-)*?\1;/g

	token: string = ''

	private static request(options: Options): Promise<string> {
		return new Promise(resolve => {

			const ret: Buffer[] = [];

			https.request(options, (res) => {

				res.on('data',
					data => Buffer.isBuffer(data) ? ret.push(data) : ret.push(new Buffer(data)))

				res.on('end', () => resolve(Buffer.concat(ret).toString()))

			}).on('error', (e) => {
				resolve('')
			}).end()
		})
	}

	private extractTokenFromHtml(html: string): string {
		const tkn = DZApi.rexp.exec(html)
		if (tkn !== null)
			return tkn[0].slice(13, -2)
		return ''
	}

	getTrack(id: string | number): Promise<any | undefined> {
		return new Promise(resolve => {
			console.log(`/ajax/gw-light.php?method=deezer.pageTrack&input=3&api_version=1.0&api_token=${this.token}`)
			DZApi.request({
				hostname: 'www.deezer.com',
				method: 'POST',
				path: `/ajax/gw-light.php?method=deezer.pageTrack&input=3&api_version=1.0&api_token=${this.token}`,
				body: { "sng_id": id, "lang": "en", "tab": 0 },
			}).then(track => resolve(track))
		})
	}

	getToken(): Promise<boolean> {
		return new Promise(resolve => {
			DZApi.request({
				hostname: 'www.deezer.com',
				port: 443,
				path: '/en/',
				method: 'GET'
			}).then(html => {
				this.token = this.extractTokenFromHtml(html)
				resolve(true)
			})
		})
	}
}

async function entry() {
	const api = new DZApi()
	await api.getToken()

	console.log(await api.getTrack(367505291))

	console.log(api.token)
}

entry()