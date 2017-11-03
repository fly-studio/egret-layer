namespace layer.ui {
	export class LoadingUI extends egret.Sprite {
		private textField: egret.TextField;
		constructor()
		{
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		};

		private onAddToStage(event: egret.Event) : void
		{
			this.textField = new egret.TextField();
			this.addChild(this.textField);
			this.textField.y = (this.stage.stageHeight - 100) / 2;
			this.textField.width = this.stage.stageWidth;
			this.textField.height = 100;
			this.textField.textAlign = "center";
		};

		/**
		 * [setProgress description]
		 * @param {number} current [description]
		 * @param {number} total   [description]
		 */
		setProgress(current: number, total: number) : void {
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
		loadConfig(resourceFiles: Array<string>, onComplete: Function, thisObject: any) : void {
			let _onComplete:(event: RES.ResourceEvent) => void = function(event: RES.ResourceEvent){
				RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, _onComplete, this);
				if (onComplete) onComplete.call(thisObject ? thisObject : this, event);
			};
			RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, _onComplete, this);
			RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadErr, this);

			for(let i:number = 0; i < resourceFiles.length; i++)
				RES.loadConfig(resourceFiles[i], resourceFiles[i].replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/');
		};

		private onConfigLoadErr(event: RES.ResourceEvent) : void {

		};

		/**
		 * 读取Group文件
		 * @param {string}   name       [description]
		 * @param {Function} onComplete [description]
		 * @param {any}      thisObject [description]
		 */
		loadGroup(name: string, onComplete: Function, thisObject: any) : void {
			let _onComplete:(event: RES.ResourceEvent) => void = function(event: RES.ResourceEvent) {
				if (event.groupName == name) {
					RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, _onComplete, this);
					RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
					RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
					RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
					if (onComplete) onComplete.call(thisObject ? thisObject : this, event, name);
				}
			};
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _onComplete, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

			RES.loadGroup(name);
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
