import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import { updateTab } from '../actions/Tab'

export function getImageFromPlaylist(playlist) {
	try {
		return playlist.images[0]['url']
	} catch (e) {
		return ''
	}
}
class Spotify extends Component {

	constructor(props) {
		super(props)

		this.state = {
			loggedIn: false,
			playlists: [],
		}

		this.login = this.login.bind(this)
	}

	componentDidMount() {
		this.login()
	}

	login() {
		ipcRenderer.send('Spotify', { action: 'login', payload: {} })
		ipcRenderer.once('Spotify', (event, arg) => {
			this.setState({ loggedIn: true, profile: arg })
			this.getPlaylists()
		})
	}

	getPlaylists() {
		ipcRenderer.send('Spotify', { action: 'get:own:playlists', payload: {} })
		ipcRenderer.once('Spotify', (event, arg) => {
			this.setState({ playlists: arg.items })
		})
	}

	render() {
		if (!this.state.loggedIn) return (
			<div className="box is-radiusless has-background-light has-text-centered">
				<button className="button" onClick={this.login}>Login to Spotify</button>
			</div>
		)
		else return (<div className="section no-padding-top">
			{this.state.playlists.map(playlist => (
				<a key={playlist.id} className="box" onClick={() => this.props.switchTab(`playlist:${playlist.href}`)}>
					<article className="media">
						<div className="media-left">
							<figure className="image is-32x32">
								<img src={getImageFromPlaylist(playlist)} alt="Image" />
							</figure>
						</div>
						<div className="media-content">
							<span className="is-size-5">{playlist.name}</span>
						</div>
						<div className="media-right">
							<span className="has-text-weight-semibold">{playlist.tracks.total} <i className="icon ion-music-note" aria-hidden="true" /></span>
						</div>
					</article>
				</a>
			))}
		</div>)
	}
}

export default connect(
	state => ({
		activeTab: state.Tab.active
	}),
	dispatcher => ({
		switchTab: (tab) => dispatcher(updateTab(tab))
	}))(Spotify)