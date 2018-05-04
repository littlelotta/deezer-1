import React, { Component } from 'react'
import { send } from '../../index'
import { connect } from 'react-redux'

class Settings extends Component {

	render() {
		const { dlDir, spotifyActivated } = this.props.settings
		return (
			<div id="playlist" className="section no-padding-top">
				<div className="box">
					<div className="field">
						<label className="label">Donwload Folder</label>
						<div className="control">
							<input onClick={() => send('Settings', 'set:dlFolder')} className="input" type="text" value={dlDir} readOnly />
						</div>
					</div>
					<div className="field">
						<label className="label">Spotify</label>
						<div className="control">
							{spotifyActivated ?
								<input type="button" className="button is-danger" onClick={() => { send('Spotify', 'do:logout') }} value="Logout of Spotify" />
								:
								<input type="button" className="button is-info" onClick={() => { send('Spotify', 'do:login') }} value="Login into your Spotify" />
							}
						</div>
					</div>
					<div className="field">
						<label className="label">App</label>
						<div className="control">
							<input type="button" className="button is-danger" onClick={() => { send('Settings', 'do:reset') }} value="Reset App Data" />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		settings: state.Settings
	}),
	dispatcher => ({}))(Settings)