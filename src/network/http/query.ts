namespace layer.http {
	//export var token: string = typeof window['LP']['csrf'] == 'undefined' ? '' : window['LP']['csrf'];;
	export var baseuri = typeof window['LP'] != 'undefined' && typeof window['LP']['baseuri'] != 'undefined' ? window['LP']['baseuri'] : '';
	export class Query {
		private instance: AxiosInstance;
		public autoTip: boolean = false;

		constructor()
		{
			this.instance = axios.create({
				baseURL: baseuri,
				timeout: 20000,
				/* headers: {
					'X-CSRF-TOKEN': token
				}, */
				responseType: 'json',
				xsrfHeaderName: 'X-CSRF-TOKEN',
				xsrfCookieName: 'XSRF-TOKEN' // read from cookie
			});
		}

		public request(method: string, url: string, data: Object = {})
		{
			return new Promise((resolve, reject) => {
				this.instance.request({
					method: method.toLowerCase(),
					url: url,
					params: method.toLowerCase() == 'get' ? data : {},
					data: data
				}).then(res => {
					let data = res.data;
					if (this.autoTip)
						layer.ui.lp.tip(data.result, data.message, data.tipType);

					if (data.result == 'success' || data.result == 'api')
						resolve(data);
					else
						reject(data);
				}).catch(error => {
					if (this.autoTip)
						layer.ui.alert(error);
					reject(error);
				});
			})
		}
	}
}