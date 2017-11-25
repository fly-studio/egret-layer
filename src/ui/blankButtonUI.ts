namespace layer.ui {
	export class BlankButtonUI extends layer.ui.Sprite {

		private soundRes: string;
		constructor(soundRes?: string) {
			super();
			this.soundRes = soundRes;
		}

		public onAddedToStage(e: egret.Event): void {
			this.graphics.beginFill(0x0, 0);
			this.graphics.drawRect(0, 0, this.width, this.height);
			this.graphics.endFill();
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