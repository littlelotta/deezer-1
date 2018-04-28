import React, { Component } from 'react'

import { fmt } from 'human-duration'
import hf from 'human-format'
import { URL } from '../App'

export default class extends Component {

	constructor(props) {
		super(props)

		this.dl = this.dl.bind(this)
	}

	dl(id) {
		fetch(`${URL}/download/${id}`)
			.then(response => response.json())
			.then(data => console.log(data))
			.finally(_ => {

			})
	}

	render() {
		const { SNG_TITLE, ART_NAME, ALB_TITLE, ALB_PICTURE, DURATION, FILESIZE_MP3_320, FILESIZE_FLAC, SNG_ID } = this.props
		return (
			<article className="result flex has-background-white">
				<div className="shrink">
					<p className="image is-96x96 is-hidden-desktop">
						<img src={`https://e-cdns-images.dzcdn.net/images/cover/${ALB_PICTURE}/500x500.jpg`} />
					</p>
					<p className="image is-128x128 is-hidden-touch">
						<img src={`https://e-cdns-images.dzcdn.net/images/cover/${ALB_PICTURE}/500x500.jpg`} />
					</p>
				</div>
				<div className="info grow flex">
					<div className="grow">
						<span className="title is-size-4-desktop is-size-5-touch">{SNG_TITLE}</span>
						<span className="is-pulled-right">{fmt(parseInt(DURATION) * 1000)
							.grading([
								{ unit: '%', milliseconds: 1000 * 60 },
								{ unit: x => x < 10 ? `0${x}` : `${x}`, milliseconds: 1000 },
							]).separator(':').toString()}</span>
						<br />
						<div className="secondRow">
							<span className="subtitle is-size-5-desktop is-size-6-touch has-text-info">{ART_NAME}</span>
							<span> </span>
							<span className="is-size-6-desktop is-size-7-touch">{ALB_TITLE}</span>
						</div>
					</div>
					<div className="shrink field is-grouped  dl-tags">
						<div className="control is-hidden-mobile">
							<div className="tags has-addons">
								<span className="tag"><i className="icon ion-ios-information-outline" /> Track</span>
							</div>
						</div>
						<div className="control">
							<div className="tags has-addons dl-btn" onClick={() => this.dl(SNG_ID)}>
								<span className="tag is-dark">
									<span className="is-hidden-mobile">{hf(parseInt(FILESIZE_MP3_320), { separator: '' })}</span>
									<i className="icon ion-arrow-down-c" />
								</span>
								<span className="tag is-success ">MP3 <i className="icon ion-stats-bars" /></span>
							</div>
						</div>
						<div className="control">
							<div className="tags has-addons dl-btn">
								<span className="tag is-dark">
									<span className="is-hidden-mobile">{hf(parseInt(FILESIZE_FLAC), { separator: '' })}</span>
									<i className="icon ion-arrow-down-c" />
								</span>
								<span className="tag is-success ">FLAC<i className="icon ion-stats-bars" /></span>
							</div>
						</div>
					</div>
				</div>
			</article>
		)

	}
} 