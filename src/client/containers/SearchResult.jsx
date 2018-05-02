import React, { Component } from 'react'
import { fmt } from 'human-duration'

import DownloadButton from './DownloadButton'
import Box from './Box'

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

		const cur = {
			img: `https://e-cdns-images.dzcdn.net/images/cover/${ALB_PICTURE}/500x500.jpg`
		}
		switch (__TYPE__) {
			case 'album':
				cur.id = ALB_ID
				cur.top = ALB_TITLE
				cur.left = ART_NAME
				cur.right = ''
				cur.topright = (<span><span className="tag is-info is-capitalized">{__TYPE__}</span></span>)
				break
			case 'song':
				cur.id = SNG_ID
				cur.top = SNG_TITLE
				cur.left = ART_NAME
				cur.right = ALB_TITLE
				cur.topright = (<span><span className="has-text-weight-semibold">{this.duration(DURATION)}</span> <span className="tag is-info is-capitalized">{__TYPE__}</span></span>)
				break
		}
		cur.bottom = (<div className="shrink field is-grouped  dl-tags">
			<DownloadButton {...{ type: __TYPE__, id: cur.id, fmt: 'mp3', size: FILESIZE_MP3_320 }} />
			<DownloadButton {...{ type: __TYPE__, id: cur.id, fmt: 'flac', size: FILESIZE_FLAC }} />
		</div>)

		return <Box {...cur} />
	}
} 