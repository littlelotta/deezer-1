import React, { Component } from 'react'

export default class extends Component {

	render() {
		const { img, top, topright, left, right, bottom, onClick } = this.props

		return (
			<a className="custbox box flex has-background-white" onClick={onClick}>
				<div className="shrink">
					<p className="image is-96x96 is-hidden-desktop">
						<img src={img} />
					</p>
					<p className="image is-128x128 is-hidden-touch">
						<img src={img} />
					</p>
				</div>
				<div className="info grow flex">
					<div className="grow">
						<span className="title is-size-4-desktop is-size-5-touch">{top}</span>
						<span className="is-pulled-right">{topright}</span>
						<br />
						<div className="secondRow">
							<span className="subtitle is-size-5-desktop is-size-6-touch has-text-info">{left}</span>
							<span> </span>
							<span className="is-size-6-desktop is-size-7-touch">{right}</span>
						</div>
					</div>
					{bottom}
				</div>
			</a>
		)

	}
} 