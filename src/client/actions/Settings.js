export const Settings = {
	Update: 'settings:update'
}

export const updateSettings = (obj) => {
	return {
		type: Settings.Update,
		payload: obj
	}
}