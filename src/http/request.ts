namespace layer.http {

	export const baseURI = typeof window['baseURI'] != 'undefined' ? window['baseURI'] : '';

	export function request(method: string, url: string, data: any = {}, autoTip: boolean = false): Promise<any>
	{
		return new Promise((resolve, reject) => {
			let query = new LP.http.axiosAjax(baseURI);
			query.request(method, url, data)
				.then((res: { data: any; }) => {
					let data = res.data;
					if (autoTip)
						layer.ui.lp.tip(data.result, data.message, data.tipType);

					if (data.result == 'success' || data.result == 'api')
						resolve(data);
					else
						reject(data);
				}, (error: { message: string; toString: () => string; }) => {
					if (autoTip)
						layer.ui.alert(error instanceof Error ? error.message : error.toString());
					reject(error);
				});
		});
	}

	export function form(url: string, data: any, autoTip: boolean = false): Promise<any>
	{
		return request('post', url, LP.http.objectToForm(data), autoTip);
	}

	export function get(url: string, data?: any, autoTip: boolean = false): Promise<any>
	{
		return request('get', url, data, autoTip);
	}

	export function post(url: string, data: any, autoTip: boolean = false): Promise<any>
	{
		return request('post', url, data, autoTip);
	}

	export function put(url: string, data: any, autoTip: boolean = false): Promise<any>
	{
		return request('put', url, data, autoTip);
	}

	export function patch(url: string, data: any, autoTip: boolean = false): Promise<any>
	{
		return request('patch', url, data, autoTip);
	}

	export function head(url: string, data?: any, autoTip: boolean = false): Promise<any>
	{
		return request('head', url, data, autoTip);
	}

	export function options(url: string, data?: any, autoTip: boolean = false): Promise<any>
	{
		return request('options', url, data, autoTip);
	}

	export function DELETE(url: string, data?: any, autoTip: boolean = false): Promise<any> {
		return request('delete', url, data, autoTip);
	}

	http['delete'] = DELETE;
}
