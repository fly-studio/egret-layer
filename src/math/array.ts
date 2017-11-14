namespace layer.array {

	export function unique<T>(arr: Array<T>) : Array<T> {
		return Array.from(new Set<T>(arr));
	}

	export function intersect<T>(arr1: Array<T>, ...args: Array<Array<T>>): Array<T> {
		let intersection: Array<T> = [...arr1]; //shallow copy
		for (let arr of args)
			intersection = intersection.filter(x => arr.includes(x));
		return unique<T>(intersection);
	};

	export function diff<T>(arr1: Array<T>, ...args: Array<Array<T>>): Array<T> {
		let intersection: Array<T> = [...arr1]; //shallow copy
		for (let arr of args)
			intersection = intersection.filter(x => !arr.includes(x));
		return unique<T>(intersection);
	};

	export function* xrange(start: number, stop?: number, step: number = 1) {
		if (stop == null) {
			stop = start;
			start = 0;
		}
		let i:number = start;
		if (step < 0) {
			while (i > stop) {
				yield i;
				i += step;
			}
		}
		else {
			while (i < stop) {
				yield i;
				i += step;
			}
		}
	}
}