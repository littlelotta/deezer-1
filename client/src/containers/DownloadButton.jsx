import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import hf from 'human-format'

export default class extends Component {

	constructor(props) {
		super(props)

		this.dl = this.dl.bind(this)
		this.state = { state: 0 }
	}

	dl(id, fmt) {
		if (this.state.state === 1)
			return

		this.setState({ state: 1 })
		ipcRenderer.send('API', { action: 'dl', payload: { id, fmt } })
		ipcRenderer.once('API', (event, arg) => {
			this.setState({ state: 0 })
			if (arg === false)
				alert('Error downloading')
		})
	}

	render() {
		const { FILESIZE_MP3_320, FILESIZE_FLAC, SNG_ID, fmt } = this.props
		const type = {
			mp3: {
				label: 'MP3',
				size: FILESIZE_MP3_320,
			},
			flac: {
				label: 'Flac',
				size: FILESIZE_FLAC,
			}
		}

		return (
			<div className="control">
				<div className="tags has-addons dl-btn" onClick={() => this.dl(SNG_ID, fmt)}>
					<span className="tag is-dark">
						{this.state.state === 1 ?
							(<span>Downloading...</span>) :
							(<span>
								{hf(parseInt(type[fmt]['size']), { separator: '' })}
								<i className="icon ion-arrow-down-c" />
							</span>)}
					</span>
					<span className="tag is-success ">{type[fmt]['label']} <i className="icon ion-stats-bars is-hidden-mobile" /></span>
				</div>
			</div>
		)

	}
} 