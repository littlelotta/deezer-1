import {
	Todo
} from '../actions/Todo'

const initialState = {
	todo: {
		index: 2
	},
	todos: [{
			id: 0,
			title: 'Code the world',
			body: 'Conquer the planet with Assembler'
		},
		{
			id: 1,
			title: 'Later',
			body: 'Realize assembler is a bitch'
		},
	]
}

export default (state = initialState, {
	type,
	payload
}) => {
	switch (type) {

		case Todo.mk:
			const newTodo = {
				id: state.todo.index++,
				title: payload.title,
				body: payload.body
			}
			return {
				...state,
				todos: [...state.todos, newTodo]
			}

		case Todo.rm:
			return ({
				...state,
				todos: state.todos.filter(todo => todo.id !== payload)
			})

		default:
			return state
	}
}