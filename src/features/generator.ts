/**
 * 第一个next就可以传递值
 * let generator = function* (args) {
 * 	let a = yeild;
 * }
 * wrapper(generator)(args)->next('some');
 * 
 * @param generatorFunction 
 */
function wrapper(generatorFunction: GeneratorFunction): Function {
	return function (...args) {
		let generatorObject: Generator = generatorFunction(...args);
		generatorObject.next();
		return generatorObject;
	};
}

/**
 * Object 可以被 for of 遍历
 * let jane = { first: 'Jane', last: 'Doe' };
 * jane[Symbol.iterator] = objectEntries;
 * for (let [k, v] of jane) {}
 */
function* objectEntries() {
	let propKeys: string[] = Object.keys(this);
	for (let propKey of propKeys) {
		yield [propKey, this[propKey]];
	}
}