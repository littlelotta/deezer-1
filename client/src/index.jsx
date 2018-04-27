import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from './reducers'
import App from './App'

import './assets/css/bulma.min.css'
import './assets/ionicons/less/ionicons.less'
import './assets/less/app.less'

let store = createStore(rootReducer)

function render() {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>
		, document.getElementById('root')
	)
}

store.subscribe(render)
render()