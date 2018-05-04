import React, { Component } from 'react'
import { connect } from 'react-redux'

import { send } from '../../index'
import Box from '../Box'
import DownloadButton from '../DownloadButton'
import { getImageFromPlaylist } from '../Spotify/Main'
import { duration } from '../Search/Result'

export const separator = 'playlist:'

class Spotify extends Component {

	constructor(props) {
		super(props)

		this.state = {
			tracks: { items: [] }
		}

		this.getPlaylist = this.getPlaylist.bind(this)
		this.getTracks = this.getTracks.bind(this)
	}

	componentDidMount() {
		this.getPlaylist()
	}

	getPlaylist(id) {
		send('Spotify', 'get:playlist', { link: this.props.activeTab.slice((separator.length)) })
			.then(arg => {
				this.setState(arg)
				this.getTracks()
			})
	}

	getTracks() {
		send('Spotify', 'get:iterable', { iterable: this.state.tracks })
			.then(arg => this.setState({ tracks: Object.assign(this.state.tracks, { items: arg }) }))
	}

	render() {
		return (
			<div id="playlist" className="section no-padding-top">
				<Box {...{
					img: getImageFromPlaylist(this.state),
					top: this.state.name,
					topright: (<span className="tag is-info is-capitalized">Playlist</span>),
					left: (<i className="icon ion-music-note" aria-hidden="true" />),
					right: (<span className="has-text-weight-semibold">{this.state.tracks.total}</span>),
					bottom: (<div className="shrink field is-grouped  dl-tags">
						<DownloadButton {...{ type: 's:playlist', id: this.href, fmt: 'mp3' }} />
						<DownloadButton {...{ type: 's:playlist', id: this.href, fmt: 'flac' }} />
					</div>)
				}} />
				<div className="box">
					<table className="songs table">
						<thead>
							<tr>
								<th className="is-hidden-mobile"><i className="icon ion-ios-photos" aria-hidden="true" /></th>
								<th><i className="icon ion-ios-clock" aria-hidden="true" /></th>
								{/* <th><i className="icon ion-arrow-down-c" aria-hidden="true" /></th> */}
								<th><abbr title="Song">Song</abbr></th>
								<th><abbr title="Song">Artist</abbr></th>
								<th className="is-hidden-touch"><abbr title="Song">Album</abbr></th>
							</tr>
						</thead>
						<tbody>
							{this.state.tracks.items.map((track, i) => {
								const q = [track.track.name, track.track.album.name, track.track.artists.map(item => item.name).join(' ')]
								return (
									<tr key={i + track.track.uri} className="song">
										<td className="is-hidden-mobile">
											<figure className="image is-64x64">
												<img src={getImageFromPlaylist(track.track.album)} />
											</figure>
										</td>
										<td>{duration(parseInt(track.track.duration_ms) / 1000)}</td>
										<td>{track.track.name}
											<div className="dl-tags field is-grouped">
												<DownloadButton {...{ type: 's:track', id: q, fmt: 'mp3' }} />
												<DownloadButton {...{ type: 's:track', id: q, fmt: 'flac' }} />
											</div>
										</td>
										<td>{track.track.artists.map(item => item.name).join(', ')}</td>
										<td className="is-hidden-touch">{track.track.album.name}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
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