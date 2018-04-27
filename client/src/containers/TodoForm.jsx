import React, { Component } from 'react'
import { connect } from 'react-redux'

import { mkTodo } from '../actions/Todo'

class TodoForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			title: '',
			body: ''
		}
	}

	handleChange(propertyName, event) {
		this.setState({ [propertyName]: event.target.value })
	}

	render() {
		const { submit } = this.props

		return (
			<div>
				<h4>New Todo</h4>
				<div className="control">
					<input className="input" type="text" placeholder="Titile" onChange={this.handleChange.bind(this, 'title')} />
				</div>
				<br />
				<div className="control">
					<input className="input" type="text" placeholder="body" onChange={this.handleChange.bind(this, 'body')} />
				</div>
				<br />
				<button className="button is-success" onClick={() => submit({ title: this.state.title, body: this.state.body })}>Create!</button>
			</div>
		)
	}
}

const mapStateToProps = state => ({})

const mapDispatchToPropd = dispatch => ({
	submit: (obj) => dispatch(mkTodo(obj))
})

export default connect(mapStateToProps, mapDispatchToPropd)(TodoForm)