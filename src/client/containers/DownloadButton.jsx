import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import hf from 'human-format'

export default class extends Component {

	constructor(props) {
		super(props)

		this.dl = this.dl.bind(this)
		this.state = { state: 0 }
	}

	dl(id, fmt, type) {
		if (this.state.state === 1)
			return

		this.setState({ state: 1 })
		ipcRenderer.send('Deezer', { action: `dl:${type}`, payload: { id, fmt } })
		const listenter = (event, arg) => {
			if (arg !== false && arg != id) return
			ipcRenderer.removeListener('Deezer', listenter)
			this.setState({ state: 0 })
			if (arg === false)
				alert('Error downloading')
		}
		ipcRenderer.on('Deezer', listenter)
	}

	mkSize(num) {
		num = parseInt(num)
		if (isNaN(num)) return
		else return hf(num, { separator: '' })
	}

	render() {
		const { type, id, fmt, size } = this.props

		return (
			<div className="control">
				<div className="tags has-addons dl-btn" onClick={() => this.dl(id, fmt, type)}>
					<span className="tag">
						{this.state.state === 1 ?
							(<span>Downloading...</span>) :
							(<span>
								{this.mkSize(size)}
								<i className="icon ion-arrow-down-c" />
							</span>)}
					</span>
					<span className="tag is-dark is-uppercase">{fmt} <i className="icon ion-stats-bars is-hidden-mobile" /></span>
				</div>
			</div>
		)

	}
} 