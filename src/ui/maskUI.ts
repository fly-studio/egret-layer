namespace layer.ui {
	export class MaskUI extends layer.ui.Sprite {

		protected maskColor: number;
		protected maskAlpha: number;

		constructor(color:number = 0x0, alpha: number = .8) {
			super();

			this.maskColor = color;
			this.maskAlpha = alpha;
		}

		public onAddedToStage(e: egret.Event): void
		{
			this.width = this.width > 0 ? this.width : this.stage.stageWidth;
			this.height = this.height > 0 ? this.height : this.stage.stageHeight;
			this.onResize();
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
		}

		protected onResize(event?: egret.Event)
		{
			this.graphics.clear();
			this.graphics.beginFill(this.maskColor, this.maskAlpha);
			this.graphics.drawRect(0, 0, this.width, this.height);
			this.graphics.endFill();
		}

	}
}