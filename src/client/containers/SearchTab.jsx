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
			filters: {
				song: true,
				album: false,
			}
		}

		this.search = this.search.bind(this)
		this.toggleFilter = this.toggleFilter.bind(this)
		this.removeFilters = this.removeFilters.bind(this)
	}

	componentDidMount() {
	}

	toggleFilter(filter) {
		const cur = this.state.filters[filter]
		this.setState({
			filters: Object.assign(this.state.filters, {
				[filter]: !cur
			})
		})
	}

	removeFilters() {
		const cur = this.state.filters
		for (const i in cur)
			cur[i] = true
		this.setState(cur)
	}

	setStateAsync(state) {
		return new Promise(res => this.setState(state, res))
	}

	search(e) {
		if (e === false) e = Object.assign({}, { target: { value: this.state.input } })
		if (e === undefined || e.target.value === undefined || e.target.value.replace(' ', '').length < 3) return

		this.setStateAsync({ input: e.target.value }).then(_ => {
			if (this.state.isLoading === true) return

			this.setStateAsync({
				isLoading: true,
				lastSearch: this.state.input
			}).then(_ => {
				ipcRenderer.send('Deezer', { action: 'search', payload: this.state.lastSearch })
				ipcRenderer.once('Deezer', (event, arg) => {
					this.setStateAsync({ isLoading: false, results: arg }).then(_ => {
						if (this.state.lastSearch !== this.state.input) this.search(false)
					})
				})
			})
		})
	}

	getId(item) {
		switch (item.__TYPE__) {
			case 'album':
				return item.ALB_ID + Buffer.from(item.ALB_TITLE).toString('base64')
			case 'song':
				return item.SNG_ID + Buffer.from(item.SNG_TITLE).toString('base64')
			default:
				return Math.random().toString(36).replace(/[^A-z]+/g, '')
		}
	}

	render() {
		return (
			<div className="section no-padding-top" id="search">
				<div className="field">
					<div className={`control ${this.state.isLoading ? 'is-loading' : ''}`}>
						<input className="input" type="text" placeholder="Search..." onChange={this.search} />
					</div>
				</div>
				<div className="buttons">
					<a className="button is-small" onClick={this.removeFilters}>Reset filters</a>
					{Object.keys(this.state.filters).map(filter => <a key={filter} className={`button is-small is-capitalized ${this.state.filters[filter] ? 'is-success' : 'is-danger'}`} onClick={() => this.toggleFilter(filter)}>{filter}</a>)}
				</div>
				<hr />
				<div className="results">
					{this.state.results.filter((item) => {
						return this.state.filters[item.__TYPE__]
					}).map(result => <SearchResult {...result} key={this.getId(result)} />)}
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