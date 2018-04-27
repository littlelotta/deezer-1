import React from 'react'
import { connect } from 'react-redux'

import { rmTodo } from '../actions/Todo'

const TodoItem = ({ todo, destroyTodo }) => {
	return (
		<div>
			<article className="box">
				<h4>{todo.title}</h4>
				<div className="columns">
					<div className="column">
						<p>{todo.body}</p>
					</div>
					<div className="column is-narrow">
						<a className="button is-danger" onClick={() => destroyTodo(todo.id)}><i className="fa fa-trash"></i></a>
					</div>
				</div>
			</article>
			<br />
			{/* <h4>{todo.title}</h4>
			<p>{todo.body}</p> */}
			{/* <span onClick={() => destroyTodo(todo.id)}> x </span> */}
		</div>
	)
}

const TodoList = ({ todos, destroyTodo }) => (
	<div className="content">
		{todos.map(todo => <TodoItem key={todo.id} todo={todo} destroyTodo={destroyTodo} />)}
	</div>
)


const mapStateToProps = state => ({
	todos: state.Todo.todos
})

const mapDispatchToProps = dispatch => ({
	destroyTodo: (id) => dispatch(rmTodo(id))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList)