import React, { Component } from 'react'

import Search from './SearchTab'
import Switch from './TabSwitch'

export default class extends Component {

	render() {
		return (
			<div>
				<section className="hero is-info" id="header">
					<div className="hero-body">
						<div className="columns">
							<div className="column is-hidden-mobile" />
							<div className="column is-12-mobile is-10-tablet is-9-desktop is-8-widescreen is-7-fullhd">
								<h1 className="title">Deezer Ripper</h1>
								<h2 className="subtitle">HQ Downloader</h2>
							</div>
							<div className="column is-hidden-mobile" />
						</div>
					</div>
				</section>

				<div className="columns">
					<div className="column is-hidden-mobile" />
					<div className="column is-12-mobile is-10-tablet is-9-desktop is-8-widescreen is-7-fullhd">
						<Switch />
						<div id="switchBody">
							<Search />
						</div>
					</div>
					<div className="column is-hidden-mobile" />
				</div>
			</div>
		)
	}
}