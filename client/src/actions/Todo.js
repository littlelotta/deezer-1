export const Todo = {
	mk: 'todo:add',
	rm: 'todo:remove'
}

export const mkTodo = ({
	title,
	body
}) => {
	return {
		type: Todo.mk,
		payload: {
			title,
			body
		}
	}
}

export const rmTodo = (id) => {
	return {
		type: Todo.rm,
		payload: id
	}
}