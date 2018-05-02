import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import { getImageFromPlaylist } from './Spotify'

export const separator = 'playlist:'
class Spotify extends Component {

	constructor(props) {
		super(props)

		this.state = {
			tracks: { items: [] }
		}

		this.getPlaylistLink = this.getPlaylistLink.bind(this)
		this.getPlaylist = this.getPlaylist.bind(this)
		this.getTracks = this.getTracks.bind(this)
	}

	componentDidMount() {
		this.getPlaylist()
	}

	getPlaylistLink() {
		return this.props.activeTab.slice((separator.length))
	}

	getPlaylist(id) {
		ipcRenderer.send('Spotify', { action: 'get:playlist', payload: { link: this.getPlaylistLink() } })
		ipcRenderer.once('Spotify', (event, arg) => {
			console.log(arg)
			this.setState(arg)
			this.getTracks()
		})
	}

	getTracks() {
		ipcRenderer.send('Spotify', { action: 'get:iterable', payload: { iterable: this.state.tracks } })
		ipcRenderer.once('Spotify', (event, arg) => {
			this.setState({ tracks: Object.assign(this.state.tracks, { items: arg }) })
		})
	}

	render() {
		return (
			<div id="playlist" className="section no-padding-top">
				<div className="box">
					<figure className="image is-128x128">
						<img src={getImageFromPlaylist(this.state)} />
					</figure>
					<span className="is-size-2">{this.state.name}</span>
					<ul className="songs">
						{this.state.tracks.items.map((track, i) => (
							<li key={i + track.track.uri}>{track.track.name}</li>
						))}
					</ul>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		activeTab: state.Tab.active
	}),
	dispatcher => ({}))(Spotify)