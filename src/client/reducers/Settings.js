import {
	Settings
} from '../actions/Settings'

const initialState = {
	dlDir: '/Downloads',
}

export default (state = initialState, {
	type,
	payload
}) => {
	switch (type) {

		case Settings.Update:
			return {
				...state,
				...payload
			}

		default:
			return state
	}
}