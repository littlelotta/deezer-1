declare module 'node-id3' {
	export type Callback = (error: string, buffer: Buffer) => any;

	export function update(tags: any, file: string, callback: Callback): void
	export function update(tags: any, file: string): boolean
}

declare module 'mkdir-recursive' {
	export function mkdirSync(path: string, mode?: number): void
}

declare module 'querystring' {
	export function stringify(data: any): string
}