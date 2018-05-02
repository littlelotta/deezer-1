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
		ipcRenderer.send('API', { action: `dl:${type}`, payload: { id, fmt } })
		ipcRenderer.once('API', (event, arg) => {
			console.log(arg)
			this.setState({ state: 0 })
			if (arg === false)
				alert('Error downloading')
		})
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
					<span className="tag is-dark">
						{this.state.state === 1 ?
							(<span>Downloading...</span>) :
							(<span>
								{this.mkSize(size)}
								<i className="icon ion-arrow-down-c" />
							</span>)}
					</span>
					<span className="tag is-success is-uppercase">{fmt} <i className="icon ion-stats-bars is-hidden-mobile" /></span>
				</div>
			</div>
		)

	}
} 