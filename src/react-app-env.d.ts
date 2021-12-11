/// <reference types="react-scripts" />

declare module '@nastyox/rando.js' {
	export function randoSequence<T>(items: T[]): {
		index: number,
		value: T
	}[]
}