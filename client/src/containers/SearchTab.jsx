import React, { Component } from 'react'
import { connect } from 'react-redux'

import SearchResult from './SearchResult'
import { URL } from '../App'

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
		if (e !== undefined)
			this.setState({ input: e.target.value })
		if (this.state.isLoading === true) return
		this.setState({ isLoading: true })

		const cur = String(this.state.input)
		fetch(`${URL}/search/${cur}`)
			.then(response => response.json())
			.then(data => this.setState({ results: data }))
			.finally(_ => {
				this.setState({ isLoading: false })
				if (cur !== this.state.input)
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