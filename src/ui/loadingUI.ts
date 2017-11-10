namespace layer.ui {
	export interface ResourceConfig {
		resourceFile: string,
		path?: string
	}
	export class LoadingUI extends layer.ui.Sprite {
		private textField: egret.TextField;
		private _resourceConfig: ResourceConfig;
		private _groupList: string[];
		private configDeferred: DeferredPromise;
		private groupDeferreds: Map<string, DeferredPromise>;

		public set resourceConfig(value: ResourceConfig) {
			this._resourceConfig = value;
		}

		public get resourceConfig(): ResourceConfig {
			return this._resourceConfig;
		}

		public set groupList (value:string[]) {
			this._groupList = value;
		}

		public get groupList() : string[] {
			return this._groupList;
		}

		constructor()
		{
			super();

			this._resourceConfig = {
				resourceFile: '',
				path: '',
			};
			this._groupList = [

			];
			this.groupDeferreds = new Map<string, DeferredPromise>();
		};

		public async load()
		{
			if (!this.resourceConfig.resourceFile || !this.groupList.length) {
				throw new Error('Please set resourceConfig, groupList first.');
			}

			await this.loadConfig();
			let promises: Promise<void>[] = [];
			for (let group of this.groupList)
				promises.push(this.loadGroup(group));
			return Promise.all(promises);
		}

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

			this.bindEvents();

			this.loadConfig();
		}

		public onRemovedFromStage(e: egret.Event) : void
		{
			this.removeAllEventListeners();
			this.groupDeferreds.clear();
			this._resourceConfig = {
				resourceFile: '',
				path: '',
			};
			this._groupList = [

			];
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
		private loadConfig(): Promise<void> {
			this.configDeferred = new DeferredPromise;

			let {resourceFile, path} = this.resourceConfig;
			RES.loadConfig(resourceFile, path || resourceFile.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/');

			return this.configDeferred.promise();
		}

		/**
		 * 读取Group文件
		 * @param {string}   groupName  [description]
		 * @param {Function} onComplete [description]
		 * @param {any}      thisObject [description]
		 */
		private loadGroup(groupName: string) : Promise<void> {
			var dfd = new DeferredPromise();
			this.groupDeferreds.set(groupName, dfd);
			RES.loadGroup(groupName);
			return dfd.promise();
		};

		private onConfigError(event: RES.ResourceEvent): void {
			this.configDeferred.reject(false);

			//if (this.groupDeferreds.has(this.getKey(LoadingUI.CONFIG, event.)))
		}

		private onConfigComplete(event: RES.ResourceEvent): void {
			this.configDeferred.resolve(true);
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
