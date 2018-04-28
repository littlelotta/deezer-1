import React, { Component } from 'react'

import Search from './SearchTab'
import Switch from './TabSwitch'

export default class extends Component {

	render() {
		return (
			<div>
				<div id="spacer" className="is-hidden-mobile"></div>
				<section className="hero is-info">
					<div className="hero-body">
						<div className="container">
							<h1 className="title">Deezer Ripper</h1>
							<h2 className="subtitle">HQ Downloader</h2>
						</div>
					</div>
				</section>

				<Switch />
				<div id="switchBody">
					<Search />
				</div>
			</div>
		)
	}
}