namespace layer.ui.ready {
	export class CircleUI extends layer.ui.Ready {

		protected circleSprite: egret.Sprite;

		public onAddedToStage(event: egret.Event): void {
			let radius: number = this.stage.stageHeight;
			let circlePos: egret.Point = new egret.Point(this.stage.stageWidth / 2, this.stage.stageHeight * 1.5);

			//mask
			this.addChild(new layer.ui.MaskUI(0xffffff, .5));

			this.circleSprite = new egret.Sprite;

			this.circleSprite.anchorOffsetX = radius;
			this.circleSprite.anchorOffsetY = radius;
			this.circleSprite.x = circlePos.x;
			this.circleSprite.y = circlePos.y;

			//draw
			let avg: number = 360 / this.readyRes.length;
			[...this.readyRes].reverse().forEach((v, i) => {
				if (v.duration == null) v.duration = 1000;
				let bmp: layer.ui.BitmapUI = new layer.ui.BitmapUI(v.imageRes);
				bmp.anchorOffsetX = bmp.width / 2;
				bmp.anchorOffsetY = bmp.height / 2;
				let pt: sharp.Point = sharp.circlePoint(new sharp.Point(radius, radius), radius, sharp.d2r(avg * i));
				bmp.x = pt.x;
				bmp.y = pt.y;
				bmp.rotation = avg * (i + 1);
				this.circleSprite.addChild(bmp);
			});


			this.addChild(this.circleSprite);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {
		}

		public animating(): Promise<any>
		{
			return new Promise<any>(resolve => {
				if (this.readyRes.length == 0)
				{
					this.destroy();
					resolve();
					return;
				}
				let tween: egret.Tween = egret.Tween.get(this.circleSprite).call(() => {
					layer.media.Sound.play(this.readyRes[0].soundRes);
				}, this).wait(this.readyRes[0].duration / 2);
				let avg: number = 360 / this.readyRes.length;
				for (let i: number = 1; i < this.readyRes.length; i++) {
					let res = this.readyRes[i];
					tween = tween
						.to({ rotation: avg * i }, res.duration / 2)
						.call(() => {
							layer.media.Sound.play(res.soundRes);
						}, this)
						.wait(res.duration / 2);
				}
				tween.call(() => {
					this.destroy();
					resolve();
				}, this);
			});
		}

	}
}