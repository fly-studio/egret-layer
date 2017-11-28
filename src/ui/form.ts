namespace layer.ui {
	export class Form {
		public method: string = 'post';
		public action: string = '';
		public autoTip: boolean = true;
		protected fields: egret.DisplayObject[];

		constructor()
		{
			this.fields = [];
		}

		public get data(): FormData {
			let d = new FormData();
			this.fields.forEach(v => {
				if (v instanceof egret.TextField)
					d[v.name] = v.text;
				// else if ()
			});
			return d;
		}

		public addInput(...fields: egret.DisplayObject[]) {
			fields.forEach(field => this.fields.push(field));
		}

		public submit()
		{
			return layer.http.request(this.method, this.action, this.data, this.autoTip);
		}
	}
}