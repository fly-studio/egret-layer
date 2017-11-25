namespace layer.ui {
	export class MaskUI extends layer.ui.Sprite {

		constructor(color:number = 0x0, alpha: number = .8) {
			super();

			this.graphics.beginFill(color, alpha);
			this.graphics.drawRect(0, 0, this.getStage().stageWidth, this.getStage().stageHeight);
			this.graphics.endFill();
		}

		public addToStage(stage?: egret.Stage): void {

		}

		public onAddedToStage(e: egret.Event): void
		{

		}

		public onRemovedFromStage(e: egret.Event): void
		{

		}

		public removeAllEventListeners(): void
		{

		}
	}
}