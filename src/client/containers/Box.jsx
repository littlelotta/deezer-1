import React, { Component } from 'react'

export default class extends Component {

	render() {
		const { img, top, topright, left, right, bottom } = this.props

		return (
			<a className="custbox box flex has-background-white">
				<div className="shrink">
					<p className="image is-96x96 is-hidden-desktop">
						<img src={`https://e-cdns-images.dzcdn.net/images/cover/${img}/500x500.jpg`} />
					</p>
					<p className="image is-128x128 is-hidden-touch">
						<img src={`https://e-cdns-images.dzcdn.net/images/cover/${img}/500x500.jpg`} />
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