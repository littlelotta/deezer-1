import React from 'react'

import Tabs from './containers/Tabs'

export const URL = 'http://localhost:3000'

export default () => (
	<div className="container">
		<div className="columns is-mobile">
			<div className="column is-hidden-mobile" />
			<div className="column is-12-mobile is-10-tablet is-9-desktop is-8-widescreen is-7-fullhd">
				<Tabs />
			</div>
			<div className="column is-hidden-mobile" />
		</div>
	</div>
)