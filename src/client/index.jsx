import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { ipcRenderer } from 'electron'

import rootReducer from './reducers'
import App from './App'

import './assets/css/bulma.min.css'
import './assets/ionicons/less/ionicons.less'
import './assets/less/app.less'
import { updateSettings } from './actions/Settings';

let store = createStore(rootReducer)

export function getSettings() {
	return send('Settings', 'get', undefined, false).then(settings => store.dispatch(updateSettings(settings)))
}

export function send(channel, action, payload, update = true) {
	return new Promise(res => {
		ipcRenderer.send(channel, {
			action,
			payload
		})
		ipcRenderer.once(channel, (event, arg) => {
			if (update) getSettings()
			res(arg)
		})
	})
}

function render() {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>
		, document.getElementById('root')
	)
}

getSettings()
store.subscribe(render)
render()