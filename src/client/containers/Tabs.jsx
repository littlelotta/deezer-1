import React, { Component } from 'react'
import { connect } from 'react-redux'
import { remote, shell } from 'electron'

import Switch from './TabSwitch'
import Search from './Search/Main'
import Spotify from './Spotify/Main'
import Settings from './Settings/Main'
import Playlist, { separator } from './Spotify/Playlist'
import { updateTab } from '../actions/Tab'

class Tabs extends Component {

	render() {
		return (
			<div>
				<section className="hero is-info" id="header">
					<div className="hero-body">
						<div className="columns">
							<div className="column is-hidden-mobile" />
							<div className="column is-12-mobile is-10-tablet is-9-desktop is-8-widescreen is-7-fullhd">
								<nav className="flex center">
									<div className="shrink">
										<h1 className="title"><i className="ion ion-disc" /> Deezer Ripper</h1>
										<h2 className="subtitle">MP3 &amp; Flac</h2>
									</div>
									<div className="grow" />
									<div className="shrink" id="icons">
										<span className="flex center cliccable" onClick={() => shell.openExternal('https://github.com/CupCakeArmy/deezer')}>
											Github
											<a className="icon is-medium" ><i className="ion ion-ios-information" /></a>
										</span>
										<span className="flex center cliccable" onClick={() => this.props.switchTab('settings')}>
											Settings
											<a className="icon is-medium cliccable"><i className="ion ion-ios-cog" /></a>
										</span>
										<span className="flex center cliccable" onClick={() => remote.getCurrentWindow().close()}>
											Close
											<a className="icon is-medium"><i className="ion ion-ios-close" /></a>
										</span>
									</div>
								</nav>
							</div>
							<div className="column is-hidden-mobile" />
						</div>
					</div>
				</section>

				<div className="columns">
					<div className="column is-hidden-mobile" />
					<div className="column is-12-mobile is-10-tablet is-9-desktop is-8-widescreen is-7-fullhd">
						<Switch />

						{this.props.activeTab === 'spotify' && <Spotify />}
						{this.props.activeTab === 'search' && <Search />}
						{this.props.activeTab === 'settings' && <Settings />}
						{this.props.activeTab.startsWith(separator) && <Playlist />}
					</div>
					<div className="column is-hidden-mobile" />
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		activeTab: state.Tab.active
	}),
	dispatcher => ({
		switchTab: (tab) => dispatcher(updateTab(tab))
	}))(Tabs)