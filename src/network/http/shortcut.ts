namespace layer.http {
	export function get(url: string, data?: Object) {
		let q: Query = new Query();
		q.request('get', url, data);
	}

	export function post(url: string, data: Object) {
		let q: Query = new Query();
		q.request('post', url, data);
	}

	export function head(url: string, data: Object) {
		let q: Query = new Query();
		q.request('head', url, data);
	}

	export function options(url: string, data: Object) {
		let q: Query = new Query();
		q.request('options', url, data);
	}

	export function patch(url: string, data: Object) {
		let q: Query = new Query();
		q.request('patch', url, data);
	}

	export function put(url: string, data?: Object) {
		let q: Query = new Query();
		q.request('put', url, data);
	}

	/* export function delete(url: string, data?: Object) {
		let q: Query = new Query();
		q.request('delete', url, data);
	} */
}