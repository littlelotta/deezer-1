import React, { Component } from 'react'

export default class NavTab extends Component {

	constructor(props) {
		super(props)

		this.state = {
			activeTab: 'search'
		}
	}

	isActive(tab) {
		return tab == this.state.activeTab ? 'is-active' : ''
	}

	selectTab(tab) {
		this.setState({ activeTab: tab })
	}

	render() {
		return (
			<div className="container">
				<section className="hero is-info">
					<div className="hero-body">
						<div className="container">
							<h1 className="title">Deezer Ripper</h1>
							<h2 className="subtitle">HQ Downloader</h2>
						</div>
					</div>
				</section>

				<div className="tabs is-fullwidth">
					<ul>
						<li className={this.isActive('search')} onClick={() => this.selectTab('search')}>
							<a>
								<span className="icon is-small">
									<i className="icon ion-ios-search-strong" aria-hidden="true"></i>
								</span>
								<span>Search <small>Track/Album</small></span>
							</a>
						</li>
						<li className={this.isActive('spotify')} onClick={() => this.selectTab('spotify')}>
							<a>
								<span className="icon is-small">
									<i className="icon ion-ios-play" aria-hidden="true"></i>
								</span>
								<span>Playlist</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		)
	}
}