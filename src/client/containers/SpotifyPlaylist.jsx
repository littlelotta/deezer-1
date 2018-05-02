import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

class Spotify extends Component {

	constructor(props) {
		super(props)

		this.state = {}
	}

	getPlaylist(id) {

	}

	render() {
		if (!this.props.activeTab.startsWith('playlist:')) return null
		else return (
			<div className="section">

			</div>
		)
	}
}

export default connect(
	state => ({
		activeTab: state.Tab.active
	}),
	dispatcher => ({}))(Spotify)