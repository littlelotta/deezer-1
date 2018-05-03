import { shell } from 'electron'
import { createServer } from 'net'
import * as express from 'express'
import * as request from 'request'
import { stringify } from 'querystring'

import Settings from '../electron/Settings'


const config = require(__dirname + '/../../config.json')

const app = express()

function isPortTaken(port: number) {
	return new Promise<boolean>(res => {
		const tester = createServer()
		tester
			.once('error', () => res(false))
			.once('listening', () => tester.once('close', () => res(true)).close())
			.listen(port)
	})
}

export class Auth {
	constructor(public token: string, public refresh: string, public expires: number) { }

	private static now() {
		return Math.floor(Date.now() / 1000)
	}

	private static getTokenFromCode(code: string): Promise<Auth> {
		return new Promise((res, rej) => {
			request({
				url: 'https://accounts.spotify.com/api/token',
				method: 'post',
				form: {
					code: code,
					redirect_uri: config.spotify.redirect_uri,
					grant_type: 'authorization_code'
				},
				headers: {
					'Authorization': 'Basic ' + (Buffer.from(config.spotify.client_id + ':' + config.spotify.client_secret).toString('base64'))
				},
				json: true
			}, (error, response, body) => {
				if (!error && response.statusCode === 200) res(new this(body.access_token, body.refresh_token, this.now() + body.expires_in))
				else rej('Could not get Spotify Token')
			})
		})
	}

	public static login(): Promise<Auth> {
		return new Promise(resolve => {
			const prev = Settings.get('spotifyAuth')
			if (prev !== undefined) {
				const auth = new this(prev.token, prev.refresh, prev.expires)
				auth.renew().then(() => resolve(auth))
			} else {

				const server = app.listen(parseInt(config.spotify.redirect_uri.replace(/[^\d]/g, '')), '127.0.0.1')
				app.get('/callback', async (req, res) => {
					const auth = await this.getTokenFromCode(req.query.code)
					res.send(`<!DOCTYPE html><html><head></head><body><script>window.close();</script></body></html>`)
					res.end()
					server.close()
					Settings.set('spotifyAuth', auth)
					resolve(auth)
				})

				shell.openExternal('https://accounts.spotify.com/authorize?' + stringify({
					response_type: 'code',
					client_id: config.spotify.client_id,
					scope: 'playlist-read-private',
					redirect_uri: config.spotify.redirect_uri,
				}))
			}
		})
	}

	public renew(): Promise<boolean> {
		return new Promise((res, rej) => {
			if (this.isValid()) res()
			else request({
				url: 'https://accounts.spotify.com/api/token',
				method: 'post',
				form: {
					refresh_token: this.refresh,
					grant_type: 'refresh_token'
				},
				headers: {
					'Authorization': 'Basic ' + (Buffer.from(config.spotify.client_id + ':' + config.spotify.client_secret).toString('base64'))
				},
				json: true
			}, (error, response, body) => {
				if (error || response.statusCode !== 200) rej('Could not refresh token')
				this.token = body.access_token
				this.expires = Auth.now() + body.expires_in
				Settings.set('spotifyAuth', this)
				res()
			})
		})
	}

	isValid(): boolean {
		return this.expires > Auth.now()
	}
}

type Iterable = {
	items: any[]
	href: string,
	next: string | null,
	previous: string | null,
	total: number,
	offset: number,
	limit: number,
}

export class API {

	constructor(public auth: Auth) { }

	private mkCall(options: request.UrlOptions): Promise<any> {
		return new Promise(async (res, rej) => {
			await this.auth.renew()
			request(Object.assign({
				method: 'get',
				headers: {
					'Authorization': 'Bearer ' + this.auth.token
				},
				json: true
			}, options), function (error: any, response: any, body: any) {
				if (error) rej()
				res(body)
			})
		})
	}

	public getLink(href: string): Promise<any> {
		return this.mkCall({ url: href })
	}

	public getOwnProfile(): Promise<any> {
		return this.mkCall({ url: 'https://api.spotify.com/v1/me' })
	}

	public getOwnPlaylists(): Promise<any> {
		return this.mkCall({ url: 'https://api.spotify.com/v1/me/playlists?limit=50' })
	}

	public async getIterable(it: Iterable): Promise<any[]> {
		if (it.next === null) return it.items
		return it.items.concat(await this.getIterable(await this.getLink(it.next)))
	}
}