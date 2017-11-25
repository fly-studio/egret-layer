namespace layer.ui {
	export class ButtonUI extends layer.ui.Sprite {

		private bmpRes: string;
		private soundRes: string;
		constructor(bmpRes: string, soundRes?: string) {
			super();
			this.bmpRes = bmpRes;
			this.soundRes = soundRes;
		}

		public onAddedToStage(e: egret.Event): void {
			this.addChild(new layer.ui.BitmapUI(this.bmpRes));
			this.touchEnabled = true;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}

		public onRemovedFromStage(e: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}

		protected onTap(event: egret.TouchEvent) {
			if (this.soundRes) {
				let sound: egret.Sound = RES.getRes(this.soundRes);
				if (sound) sound.play(0, 1);
			}
		}

	}
}