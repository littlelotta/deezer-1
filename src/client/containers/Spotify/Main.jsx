import React, { Component } from 'react'
import { connect } from 'react-redux'

import { send } from '../../index'
import { updateTab } from '../../actions/Tab'
import Box from '../Box'

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
			playlists: [],
		}
	}

	componentDidMount() {
		if (this.props.spotifyActivated)
			send('Spotify', 'do:login')
				.then(_ => send('Spotify', 'get:own:playlists'))
				.then(arg => this.setState({ playlists: arg.items }))
	}

	render() {
		return !this.props.spotifyActivated ?
			<div className="box is-radiusless has-background-light has-text-centered">
				<button className="button" onClick={() => this.props.switchTab('settings')}>Login to Spotify</button>
			</div>
			:
			<div className="section no-padding-top">
				{this.state.playlists.map(playlist => (
					<Box {...{
						onClick: () => this.props.switchTab(`playlist:${playlist.href}`),
						img: getImageFromPlaylist(playlist),
						top: playlist.name,
						topright: (<span className="tag is-info is-capitalized">Playlist</span>),
						left: (<i className="icon ion-music-note" aria-hidden="true" />),
						right: (<span className="has-text-weight-semibold">{playlist.tracks.total}</span>),
					}}
						key={playlist.id} />
				))}
			</div>
	}
}

export default connect(
	state => ({
		spotifyActivated: state.Settings.spotifyActivated,
	}),
	dispatcher => ({
		switchTab: (tab) => dispatcher(updateTab(tab))
	}))(Spotify)