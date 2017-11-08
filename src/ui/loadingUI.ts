namespace layer.ui {
	export class LoadingUI extends egret.Sprite {
		private textField: egret.TextField;
		constructor()
		{
			super();
		};

		public onAddedToStage(e: egret.Event) : void
		{
			this.removeChildren();
			this.graphics.clear();

			this.textField = new egret.TextField();
			this.textField.y = (this.stage.stageHeight - 100) / 2;
			this.textField.width = this.stage.stageWidth;
			this.textField.height = 100;
			this.textField.textAlign = egret.HorizontalAlign.CENTER;
			this.textField.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.addChild(this.textField);
		}

		public onRemovedFromStage(e: egret.Event) : void
		{
			this.removeAllEventListeners();
		}

		public removeAllEventListeners() : void
		{
			RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
			RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigError, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		}

		public bindEvents() : void {
			RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
			RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigError, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		}



		/**
		 * [setProgress description]
		 * @param {number} current [description]
		 * @param {number} total   [description]
		 */
		public setProgress(current: number, total: number) : void {
			if (!this.textField) return;
			let percent:number = total > 0 ? current / total * 100 : 0;
			if (percent > 100) percent = 100;
			this.textField.text = "Loading..." + Math.round(percent) + '%';
		};

		/**
		 * 读取Config
		 * @param {Array<string>} resourceFiles [description]
		 * @param {Function}      onComplete    [description]
		 * @param {any}           thisObject    [description]
		 */
		public loadConfig(resourceFiles: Array<string>) : Promise<void> {

			return new Promise<void>((resolve: (value?:any) => void, reject: (reason?: any) => void) => {
				for(let i:number = 0; i < resourceFiles.length; i++)
					RES.loadConfig(resourceFiles[i], resourceFiles[i].replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/');
			});
		}

		/**
		 * 读取Group文件
		 * @param {string}   name       [description]
		 * @param {Function} onComplete [description]
		 * @param {any}      thisObject [description]
		 */
		public loadGroup(name: string) : Promise<void> {
			return new Promise<void>((resolve: (value?:any) => void, reject: (reason?: any) => void) => {
				RES.loadGroup(name);
			});

		};

		private onConfigError(event: RES.ResourceEvent): void {
			
		}

		private onConfigComplete(event: RES.ResourceEvent): void {
			
		}

		private onResourceLoadComplete(event: RES.ResourceEvent) : void {
			
		};

		private onItemLoadError(event: RES.ResourceEvent) : void {
			console.warn("Url:" + event.resItem.url + " has failed to load");
		};

		private onResourceLoadError(event: RES.ResourceEvent) : void {
			//TODO
			console.warn("Group:" + event.groupName + " has failed to load");
			//忽略加载失败的项目
			//Ignore the loading failed projects
			RES.ResourceEvent.dispatchResourceEvent(event.target, RES.ResourceEvent.GROUP_COMPLETE, event.groupName);
		};

		private onResourceProgress(event: RES.ResourceEvent) : void {
			this.setProgress(event.itemsLoaded, event.itemsTotal);
		};

	}
}
