namespace layer.ui {

	interface TipOptionsInterface {
		textColor:number;
		fontFamily:string;
		backgoundColor:number;
		title:string;
		content:string;
		timeout:number;
		buttons:Array<TipButtonInterface>;
		width:number;
		height:number;
	}

	export interface TipButtonInterface {
		text: string,
		textColor:number,
		onClick?: Function
	}

	export class TipUI extends egret.Sprite {
		private tipSprite: egret.Sprite;
		private options: TipOptionsInterface;
		private readonly titleHeight:number = 70;
		private readonly buttonMaxHeight:number = 75;
		private interval:number;

		constructor(options:any) {
			super();

			this.options = {
				textColor: options.textColor || 0x0,
				fontFamily: options.fontFamily || 'Microsoft Yahei',
				backgoundColor: options.backgoundColor || 0xffffff,
				title: options.title || '',
				content: options.content || '',
				timeout: !options.buttons && typeof options.timeout == 'undefined' ? 1500 : 0,
				buttons: options.buttons || [],
				width: !options.width || options.width <= 0 ? this.stage.stageWidth * 0.75 : options.width,
				height: !options.height || options.height < this.titleHeight + this.buttonMaxHeight ? this.stage.stageHeight * 0.9 : options.height
			};

			this.renderTip();
		}

		private renderTip() : void
		{
			this.removeChildren();

			//黑色遮罩
			let maskSprite:egret.Sprite = new egret.Sprite;
			maskSprite.graphics.beginFill(0x0, 0.25);
			maskSprite.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
			maskSprite.graphics.endFill();
			this.addChild(maskSprite);

			const buttonHeight:number = this.buttons.length > 0 ? this.buttonMaxHeight : 0,
				contentMaxHeight:number = this.height - this.titleHeight - buttonHeight;
			//内容
			let contentSprite:egret.TextField = new egret.TextField;
			contentSprite.name = 'content';
			contentSprite.textColor = this.textColor;
			contentSprite.fontFamily = this.fontFamily;
			contentSprite.size = 20;
			contentSprite.text = this.content;
			contentSprite.textAlign = egret.HorizontalAlign.LEFT;
			contentSprite.verticalAlign = egret.VerticalAlign.TOP;
			contentSprite.x = 15;
			contentSprite.y = this.titleHeight;
			contentSprite.width = this.width - 30;

			//限制content的高度
			if (contentSprite.height < 150) contentSprite.height = 150;
			if (contentSprite.height > contentMaxHeight) contentSprite.height = contentMaxHeight;

			//重新计算实际高度
			this.height = this.titleHeight + buttonHeight + contentSprite.height;

			//白色底色
			let tipSprite:egret.Sprite = this.tipSprite = new egret.Sprite;
			tipSprite.graphics.beginFill(this.backgoundColor, 0.95);
			tipSprite.graphics.drawRoundRect(0, 0, this.width, this.height, 50);
			tipSprite.graphics.endFill();
			tipSprite.x = (this.stage.stageWidth - this.width) / 2;
			tipSprite.y = (this.stage.stageHeight - this.height) / 2;
			this.addChild(tipSprite);

			//标题栏
			let titleSprite:egret.TextField = new egret.TextField;
			titleSprite.name = 'title';
			titleSprite.textColor = this.textColor;
			titleSprite.fontFamily = this.fontFamily;
			titleSprite.size = 35;
			titleSprite.text = this.title;
			titleSprite.textAlign = egret.HorizontalAlign.CENTER;
			titleSprite.verticalAlign = egret.VerticalAlign.MIDDLE;
			titleSprite.x = 0;
			titleSprite.y = 0;
			titleSprite.width = tipSprite.width;
			titleSprite.height = this.titleHeight;

			//按钮
			let buttonsSprite = new egret.Sprite;
			buttonsSprite.name = 'buttons';
			if (this.buttons.length > 0) {
				buttonsSprite.x = 0;
				buttonsSprite.y = tipSprite.height - this.buttonMaxHeight;
				buttonsSprite.width = this.width;
				buttonsSprite.height = this.buttonMaxHeight;
				let cellWidth:number = buttonsSprite.width / this.buttons.length;
				//draw top border
				buttonsSprite.graphics.lineStyle(1, 0xcccccc);
				buttonsSprite.graphics.moveTo(0, 0);
				buttonsSprite.graphics.lineTo(buttonsSprite.width, 0);
				//draw button's border
				for (let i:number = 1; i < this.buttons.length; i++) {
					buttonsSprite.graphics.moveTo(cellWidth * i, 0);
					buttonsSprite.graphics.lineTo(cellWidth * i, buttonsSprite.height);
				}
				for (let i = 0; i < this.buttons.length; i++) {
					let btn:egret.TextField = new egret.TextField;
					btn.name = 'button-' + i;
					btn.x = cellWidth * i;
					btn.y = 1;
					btn.fontFamily = this.fontFamily;
					btn.width = cellWidth;
					btn.height = buttonsSprite.height;
					btn.textColor = this.buttons[i].textColor || this.textColor;
					btn.textAlign = egret.HorizontalAlign.CENTER;
					btn.verticalAlign = egret.VerticalAlign.MIDDLE;
					btn.text = this.buttons[i].text;

					buttonsSprite.addChild(btn);
				}
			}

			tipSprite.addChild(contentSprite);
			tipSprite.addChild(titleSprite);

			tipSprite.touchEnabled = true;
			tipSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, function(e){

			}, this, true, 10);

			tipSprite.addEventListener(egret.Event.REMOVED_FROM_STAGE, function(e){
				if (maskSprite.parent) maskSprite.parent.removeChild(maskSprite);
			}, this);


			this.bindButtonsEvent();
		}

		private setDisappear(): void {
			if (this.interval)
				clearTimeout(this.interval);

			if (this.timeout > 0)
				this.interval = setTimeout(() => {
					if (this.tipSprite.parent) this.tipSprite.parent.removeChild(this.tipSprite);
				}, this.timeout);
		}

		private bindButtonsEvent() : void
		{
			let buttonsSprite:egret.Sprite = this.tipSprite.getChildByName('buttons') as egret.Sprite;
			let onClick : (e: egret.Event) => void = function(e: egret.Event) {
				e.stopPropagation();
				let buttonsSprite:egret.Sprite = this.tipSprite.getChildByName('buttons') as egret.Sprite;
				for(var i:number = 0; i < buttonsSprite.numChildren;++i)
					if (buttonsSprite.getChildAt(i).hashCode == e.currentTarget.hashCode)
						if (this.buttons[i].onClick instanceof Function) this.buttons[i].onClick.call(this, e);
			}

			for (let i:number = 0; i < buttonsSprite.numChildren; ++i) {
				let btn:egret.Sprite = buttonsSprite.getChildAt(i) as egret.Sprite;
				btn.touchEnabled = true;
				btn.once(egret.TouchEvent.TOUCH_TAP, onClick, this);
			}

		}

		public get textColor():number {
			return this.options.textColor;
		}
		public set textColor(value:number) {
			this.options.textColor = value;
		}
		public get fontFamily():string {
			return this.options.fontFamily;
		}
		public set fontFamily(value:string) {
			this.options.fontFamily = value;
		}
		public get backgoundColor():number {
			return this.backgoundColor;
		}
		public set backgoundColor(value:number) {
			this.backgoundColor = value;
		}
		public get title():string {
			return this.options.title;
		}
		public set title(value:string) {
			this.options.title = value;
			this.renderTip();
		}
		public get content():string {
			return this.options.content;
		}
		public set content(value:string) {
			this.options.content = value;
		}
		public get timeout():number {
			return this.options.timeout === Infinity && this.options.buttons.length <= 0 ? 1500 : this.options.timeout;
		}
		public set timeout(value:number) {
			this.options.timeout = value > 0 ? value : 0;
		}
		public get buttons():Array<TipButtonInterface> {
			return this.options.buttons;
		}
		public set buttons(value:Array<TipButtonInterface>) {
			this.options.buttons = value;
		}
		public get width():number {
			return this.options.width <= 0 && this.stage ? this.stage.stageWidth * 0.75 : this.options.width;
		}
		public set width(value:number) {
			this.options.width = value;
		}
		public get height():number {
			return this.options.height <= 0 && this.stage ? this.stage.stageHeight * 0.3 : this.options.height;
		}
		public set height(value:number) {
			this.options.height = value;
		}

	}
}
