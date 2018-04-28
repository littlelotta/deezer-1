export const Tab = {
	Switch: 'tab:switch'
}

export const updateTab = (tab) => {
	return {
		type: Tab.Switch,
		payload: tab
	}
}