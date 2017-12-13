namespace layer.ui {
	export class BlankButtonUI extends layer.ui.Sprite {

		private soundRes: string;
		constructor(soundRes?: string) {
			super();
			this.soundRes = soundRes;
		}

		public onAddedToStage(e: egret.Event): void {

			this.touchEnabled = true;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);

			this.onResize();
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
		}

		protected onTap(event: egret.TouchEvent) {
			if (this.soundRes) {
				let sound: egret.Sound = RES.getRes(this.soundRes);
				if (sound) sound.play(0, 1);
			}
		}

		protected onResize(event?: egret.Event)
		{
			this.graphics.clear();
			this.graphics.beginFill(0x0, 0);
			this.graphics.drawRect(0, 0, this.width, this.height);
			this.graphics.endFill();
		}
	}
}