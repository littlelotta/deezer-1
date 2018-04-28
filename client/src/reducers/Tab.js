import {
	Tab
} from '../actions/Tab'

const initialState = {
	active: 'search'
}

export default (state = initialState, {
	type,
	payload
}) => {
	switch (type) {

		case Tab.Switch:
			return {
				...state,
				active: payload
			}

		default:
			return state
	}
}