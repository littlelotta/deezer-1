
import * as os from 'os'
import { execSync } from 'child_process'
import { statSync } from 'fs'

type func = () => string
const fn: { [platform: string]: func } = {
	'android': unix,
	'darwin': darwin,
	'freebsd': unix,
	'linux': unix,
	'openbsd': unix,
	'sunos': unix,
	'win32': windows,
	'cygwin': unix,
}

export default (): string => {
	return fn[os.platform()]()
}

export function darwin(): string {
	return `${process.env.HOME}/Downloads`
}

export function unix(): string {
	let dir
	try {
		dir = execSync('xdg-user-dir DOWNLOAD', { stdio: [0, 3, 3] })
	} catch (_) { }
	if (dir) return dir.toString()

	let stat
	const homeDownloads = `${process.env.HOME}/Downloads`
	try {
		stat = statSync(homeDownloads)
	} catch (_) { }
	if (stat) return homeDownloads

	return '/tmp/'
}

export function windows(): string {
	return `${process.env.USERPROFILE}/Downloads`
}

