import React from 'react'

// import TodoList from './containers/TodoList'
// import TodoForm from './containers/TodoForm'
import NavTab from './containers/NavTab'

export default () => (
	<div>
		<section className="section">
			<div className="container">
				<div className="columns is-mobile">
					<div className="column is-hidden-mobile" />
					<div className="column is-12-mobile is-8-tablet is-5-desktop">
						<NavTab />
					</div>
					<div className="column is-hidden-mobile" />
				</div>
			</div>
		</section>
	</div>
)