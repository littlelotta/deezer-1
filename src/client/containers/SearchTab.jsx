import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import SearchResult from './SearchResult'

class SearchTab extends Component {

	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			results: [],
		}

		this.search = this.search.bind(this)
	}

	search(e) {
		if (e === undefined || e.target.value === undefined || e.target.value.replace(' ', '').length < 3) return
		this.setState({ input: e.target.value })
		if (this.state.isLoading === true) return

		this.setState({
			isLoading: true,
			lastSearch: this.state.input
		})
		ipcRenderer.send('API', { action: 'search', payload: this.state.lastSearch })
		ipcRenderer.once('API', (event, arg) => {
			this.setState({ isLoading: false, results: arg })
			if (this.state.lastSearch !== this.state.input)
				this.search()
		})
	}

	render() {
		if (this.props.activeTab !== 'search') return (null)

		return (
			<div className="box is-radiusless has-background-light is-shadowless">
				<div className="field">
					<div className={`control ${this.state.isLoading ? 'is-loading' : ''}`}>
						<input className="input is-radiusless" type="text" placeholder="Search..." onChange={this.search} />
					</div>
				</div>
				<hr className="has-background-info" />
				<div className="results">
					{this.state.results.map(result => <SearchResult {...result} key={result.SNG_ID} />)}
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		activeTab: state.Tab.active
	}),
	dispatch => ({
	}))(SearchTab)