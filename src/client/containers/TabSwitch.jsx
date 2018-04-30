import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateTab } from '../actions/Tab'

class TabSwitch extends Component {

	isActive(tab) {
		return tab === this.props.activeTab ? 'is-active' : ''
	}

	render() {
		const { switchTab } = this.props
		return (
			<div className="tabs is-fullwidth">
				<ul>
					<li className={this.isActive('search')} onClick={() => switchTab('search')}>
						<a>
							<span className="icon is-small">
								<i className="icon ion-ios-search-strong" aria-hidden="true"></i>
							</span>
							<span>Search</span>
						</a>
					</li>
					<li className={this.isActive('spotify')} onClick={() => switchTab('spotify')}>
						<a>
							<span className="icon is-small">
								<i className="icon ion-ios-play" aria-hidden="true"></i>
							</span>
							<span>Playlist</span>
						</a>
					</li>
				</ul>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	activeTab: state.Tab.active
})

const mapDispatchToPropd = dispatcher => ({
	switchTab: (tab) => dispatcher(updateTab(tab))
})

export default connect(mapStateToProps, mapDispatchToPropd)(TabSwitch)