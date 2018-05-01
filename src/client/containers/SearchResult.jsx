import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { fmt } from 'human-duration'

import DownloadButton from './DownloadButton'

export default class extends Component {

	duration(length) {
		const num = parseInt(length)
		if (num === NaN) return
		else return fmt(parseInt(length) * 1000)
			.grading([
				{ unit: '%', milliseconds: 1000 * 60 },
				{ unit: x => x < 10 ? `0${x}` : `${x}`, milliseconds: 1000 },
			])
			.separator(':')
			.toString()
	}

	render() {
		const { __TYPE__, SNG_TITLE, ART_NAME, ALB_TITLE, ALB_ID, ALB_PICTURE, DURATION, FILESIZE_MP3_320, FILESIZE_FLAC, SNG_ID } = this.props

		const cur = {}
		switch (__TYPE__) {
			case 'album':
				cur.id = ALB_ID
				cur.top = ALB_TITLE
				cur.left = ART_NAME
				cur.right = ''
				break
			case 'song':
				cur.id = SNG_ID
				cur.top = SNG_TITLE
				cur.left = ART_NAME
				cur.right = ALB_TITLE
				cur.topright = this.duration(DURATION)
				break
		}

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
						<span className="title is-size-4-desktop is-size-5-touch">{cur.top}</span>
						<span className="is-pulled-right">{cur.topright} <span className="tag"><i className="icon ion-ios-information-outline" />{__TYPE__}</span></span>
						<br />
						<div className="secondRow">
							<span className="subtitle is-size-5-desktop is-size-6-touch has-text-info">{cur.left}</span>
							<span> </span>
							<span className="is-size-6-desktop is-size-7-touch">{cur.right}</span>
						</div>
					</div>
					<div className="shrink field is-grouped  dl-tags">
						<DownloadButton {...{ type: __TYPE__, id: cur.id, fmt: 'mp3', size: FILESIZE_MP3_320 }} />
						<DownloadButton {...{ type: __TYPE__, id: cur.id, fmt: 'flac', size: FILESIZE_FLAC }} />
					</div>
				</div>
			</article>
		)

	}
} 