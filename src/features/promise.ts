/**
 * 可以异步使用的Promise
 * 
 */
class DeferredPromise {
	private _promise: Promise<any>;
	public resolve: (value?: any) => void;
	public reject: (reason?: any) => void;
	public then: any;
	public catch: any;
	constructor() {
		this._promise = new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
			// assign the resolve and reject functions to `this`
			// making them usable on the class instance
			this.resolve = resolve;
			this.reject = reject;
		});
		// bind `then` and `catch` to implement the same interface as Promise
		this.then = this._promise.then.bind(this._promise);
		this.catch = this._promise.catch.bind(this._promise);
		this[Symbol.toStringTag] = 'Promise';
	}

	public promise(): Promise<void> {
		return this._promise;
	}
}

interface Promise<T> {
	done(onFulfilled: (value?: any) => any, onRejected: (reason?: any) => any): void;
	finally(callback: Function): Promise<T>;
}

Promise.prototype.done = function (onFulfilled: (value?: any) => void, onRejected: (reason?: any) => void) {
	this.then(onFulfilled, onRejected)
		.catch(function (reason) {
			// 抛出一个全局错误
			setTimeout(() => { throw reason; }, 0);
		});
};

Promise.prototype.finally = function (callback: Function) {
	let P = this.constructor;
	return this.then(
		value => P.resolve(callback()).then(() => value),
		reason => P.resolve(callback()).then(() => { throw reason; })
	);
};

/**
 * 
 * @param promiseList 
 */
function* promises(promiseList: Promise<any>[]) {
	let results = [];
	try {
		for (let p of promiseList)
 			results.push(yield p instanceof Promise);
	} catch (e) {
 		return false; //failure
	}
	return results; //success
}
/**
 * 以同步的方式，运行异步的Promise
 * 
 * @example 同步得到一个ajax的数据 (因为ajax本身就是promise对象)
 * let response = asyncRun(function* (){yield ajax('http://...')});
 * @example 同步得到执行完毕所有promise
 * let results = asyncRun(promises([ajax(1), ajax(2), ...]));
 * 
 * @param generator 
 */
function asyncRun(generator: GeneratorFunction) {
	const it : Generator = generator();

	function go(result) {
		if (result.done) return result.value;

		return result.value.then(
			(value : any) => go(it.next(value)), 
			(error : any) => go(it.throw(error))
		);
	}

	return go(it.next());
}