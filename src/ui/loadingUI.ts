/// <reference path="sprite.ts" />

namespace layer.ui {
	export interface ResourceConfig {
		resourceFile: string,
		path?: string
	}
	export interface LoadStatus {
		loaded: number;
		total: number;
	}

	class LoadingUIProgress implements RES.PromiseTaskReporter {

		constructor(public groupName: string, public blankLoadingUI: BlankLoadingUI) {}
		public onProgress(current: number, total: number, resItem: RES.ResourceInfo | undefined): void {
			this.blankLoadingUI.onGroupProgress(this.groupName, current, total, resItem)
		}
	}

	export class BlankLoadingUI extends Sprite  {

		protected textField: egret.TextField;
		protected _configList: ResourceConfig[];
		protected _groupList: string[];
		protected _themeList: string[];
		protected status: Map<string, LoadStatus>;
		protected resURI: string;
		protected resVersion: string;

		public set configList(value: ResourceConfig[]) {
			this._configList = value;
		}

		public get configList(): ResourceConfig[] {
			return this._configList;
		}

		public set themeList(value: string[]) {
			this._themeList = value;
		}

		public get themeList(): string[] {
			return this._themeList;
		}

		public set groupList (value:string[]) {
			this._groupList = value;
		}

		public get groupList() : string[] {
			return this._groupList;
		}

		constructor(resURI: string = '', resVersion?: string)
		{
			super();

			this.resURI = resURI.length > 0 ? resURI : (window['resURI'] != undefined ? window['resURI'] : '');
			this.resVersion = resVersion ? resVersion : (window['resVersion'] != undefined ? window['resVersion'] : '1.0');
			if (this.resURI.length > 0 && this.resURI.substring(this.resURI.length - 1) != '/') this.resURI += '/';
			this._configList = [];
			this._groupList = [];
			this._themeList = [];
			this.status = new Map<string, LoadStatus>();
			RES.setMaxLoadingThread(3);
		};


		public addConfigFile(resourceFile: string, path: string): this {
			this._configList.push({
				resourceFile,
				path
			});
			return this;
		}

		public addConfigFiles(...args: Array<ResourceConfig>): this {
			for (let arg of args) {
				this.addConfigFile(arg.resourceFile, arg.path);
			}
			return this;
		}

		public addGroupNames(...args: Array<string>): this {
			for (let arg of args) {
				this._groupList.push(arg)
			}
			return this;
		}

		public addThemeFiles(...args: Array<string>): this {
			this._themeList.push(...args)
			return this;
		}

		protected updateStatus(name: string, loaded: number, total?: number): void {
			if (this.status.has(name)) {
				let s = this.status.get(name);
				s.loaded = loaded;
				if (typeof total != 'undefined') {
					s.total = total
				}

				this.calcTotalProgress()
			}
		}

		/**
		 * 设置好resourceConfig和groupList之后，执行本函数
		 * 注意，修改configList/groupList后重新调用load，会重新计算百分百
		 *
		 * @param {boolean} ignore_config_error: 忽略config.json文件读取错误
		 * @param {boolean} ignore_theme_error: 忽略theme.json文件读取错误
		 * @param {boolean} ignore_group_error: 忽略group读取错误
		 */
		public async load(ignore_config_error: boolean = true, ignore_theme_error: boolean = true, ignore_group_error: boolean = true): Promise<any>
		{
			if (this._configList.length + this._groupList.length + this._themeList.length <= 0) {
				throw new Error('Please set configList/groupList/themeList first.'); // runtime error
			}
			//config
			let promises: Promise<any>[] = [];
			for (let config of this._configList) {
				let dfd = this.loadConfig(config, ignore_config_error);
				promises.push(dfd);
			}

			await Promise.all(promises); //等待全部config读取完毕

			//theme
			promises = [];
			for (let theme of this._themeList) {
				let dfd = this.loadTheme(theme, ignore_theme_error);
				promises.push(dfd);
			}

			await Promise.all(promises); //等待全部theme读取完毕

			//group
			promises = [];
			for (let group of this._groupList)
			{
				let dfd = this.loadGroup(group, ignore_group_error);
				promises.push(dfd);
			}

			await Promise.all(promises).then(() => this.destroy()); // 同时请求这几个Group
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
		}

		public onRemovedFromStage(e: egret.Event) : void
		{
			this.status.clear();
			this._configList = [];
			this._groupList = [];
			this._themeList = [];
		}

		/**
		 * [setProgress description]
		 * @param {number} current
		 * @param {number} total
		 */
		public setProgress(current: number, total: number, resource?: RES.ResourceItem) : void {
			if (!this.textField)
				return;
			let percent: number = total > 0 ? current / total * 100 : 0;
			if (percent > 100)
				percent = 100;
			this.textField.text = "Loading..." + Math.round(percent) + '%';
		}

		protected calcTotalProgress(resource?: RES.ResourceItem) {
			let total: number = 0, loaded: number = 0;
			this.status.forEach(status => {
				total += status.total;
				loaded += status.loaded;
			});
			this.setProgress(loaded, total, resource);
		}

		/**
		 * 读取Config
		 * @param {Array<string>} resourceFiles
		 * @param {bool}      ignore_config_error
		 */
		protected async loadConfig(resourceConfig: ResourceConfig, ignore_config_error: boolean = true): Promise<any> {
			let { resourceFile, path } = resourceConfig;
			// 必須先添加到Map 不然已緩存的項目的成功事件會在loadConfig就觸發了

			if (path == undefined) path = resourceFile.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/';
			resourceFile = http.urlVersion(this.resURI + resourceFile, this.resVersion);
			path = this.resURI + path;

			const name = 'config: ' + resourceFile;
			this.status.set(name, {
				loaded: 0,
				total: 1
			});

			try {
				const value = await RES.loadConfig(resourceFile, path);
				this.updateStatus(name, 1);

				return value;
			} catch (reason) {
				this.updateStatus(name, 0);
				if (!ignore_config_error)
					return Promise.reject(reason);
			}
		}

		/**
		 * 读取 eui的皮肤文件
		 * @param {string} themeName
		 * @param {boolean} ignore_theme_error
		 */
		protected loadTheme(themeName: string, ignore_theme_error: boolean = true): Promise<any> {
			themeName = http.urlVersion(this.resURI + themeName, this.resVersion);

			const name = 'theme: ' + themeName;

			this.status.set(name, {
				loaded: 0,
				total: 1,
			});

			return new Promise((resolve, reject) => {
				let theme = new eui.Theme(themeName, this.getStage());
				theme.once(eui.UIEvent.COMPLETE, () => {
					if (DEBUG)
						console.info("Theme: " + themeName + " loaded.");

					this.updateStatus(name, 1)
					resolve(name);
				}, this);
			});
		}

		/**
		 * 读取Group文件
		 * @param {string}   groupName
		 * @param {boolean}  ignore_group_error
		 */
		protected async loadGroup(groupName: string, ignore_group_error: boolean = true) : Promise<any> {
			const total = RES.getGroupByName(groupName).length;

			this.status.set(groupName, {
				loaded: 0,
				total,
			});

			try {
				const value = await RES.loadGroup(groupName, 0, new LoadingUIProgress(groupName, this));
				if (DEBUG)
					console.info("Group: " + groupName + " loaded.");

				this.updateStatus(groupName, total);

				return value;
			} catch (reason) {
				if (DEBUG)
					console.warn("Group: " + groupName + " failed: " + reason);
				if (!ignore_group_error)
					return Promise.reject(reason);
			}
		};

		/**
		 * 读取group时进度回调
		 * @param groupName
		 * @param current
		 * @param total
		 * @param resItem
		 */
		public onGroupProgress(groupName: string, current: number, total: number, resItem: RES.ResourceInfo | undefined): void {

			if (DEBUG && typeof resItem != 'undefined')
				console.log("Url: " + resItem.url + " loaded of group: " + groupName);

			this.updateStatus(groupName, current)
		}

	}
}
