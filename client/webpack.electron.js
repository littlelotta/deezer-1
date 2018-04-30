const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config')

module.exports = merge(baseConfig, {
	target: 'electron-renderer',
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				ELECTRON: JSON.stringify(true)
			}
		})
	]
})