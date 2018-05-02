import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import { updateTab } from '../actions/Tab'
import Box from './Box'

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
				<Box {...{
					img: getImageFromPlaylist(playlist),
					top: playlist.name,
					topright: (<span className="tag is-info is-capitalized">Playlist</span>),
					left: (<i className="icon ion-music-note" aria-hidden="true" />),
					right: (<span className="has-text-weight-semibold">{playlist.tracks.total}</span>),
				}}
					key={playlist.id}
					onClick={() => {
						console.log('test')
						this.props.switchTab(`playlist:${playlist.href}`)
					}} />
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