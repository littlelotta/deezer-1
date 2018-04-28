import * as express from 'express'
const app = express()

import DZApi from './deezer'

let api: DZApi

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	next()
})

const safe = (func: (req: express.Request, res: express.Response) => Promise<any>) => {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		func(req, res).then(ret => {
			res.json(ret)
			next()
		}).catch((err) => {
			res.json({ error: true, msg: 'Internal Server Error' })
			next()
		})
	}
}

app.get('/search/:query',
	safe((req, res) => api.search(req.params['query']))
)

app.get('/download/:id',
	safe((req, res) => api.dlTrack(req.params['id']))
)

DZApi.newAsync().then(ret => {
	console.log('API Starting...')
	api = ret
	app.listen(3000, () => console.log('API Up'))
})

// const search = await api.search('Nobody A little')
// const info = await api.getTrackJSON(search[0]['SNG_ID'])
// const ret = await DZCrypt.downloadTrack(info)
