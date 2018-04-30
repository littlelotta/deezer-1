declare module 'node-id3' {

	export type Callback = (error: string, buffer: Buffer) => any;

	export function update(tags: any, file: string, callback: Callback): void
	export function update(tags: any, file: string): boolean
}