namespace layer.ui {
	export abstract class Sprite extends egret.Sprite {

		constructor() {
			super();

			this.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
		}

		/**
		 * get position
		 */
		public get position() {
			return new egret.Point(this.x, this.y);
		}

		/**
		 * set position
		 */
		public set position(value: egret.Point) {
			this.x = value.x;
			this.y = value.y;
		}

		public getStage() {
			return this.stage instanceof egret.Stage ? this.stage : egret.lifecycle.stage as egret.Stage;
		}

		public addToStage(stage?: egret.Stage) : void {
			stage = this.stage == null ? this.getStage() : stage;
			stage.addChild(this);
		}

		public destroy(): void {
			if (this.parent) this.parent.removeChild(this);
		}

		public abstract onAddedToStage(e: egret.Event) : void;

		public abstract onRemovedFromStage(e: egret.Event) : void;

		public abstract removeAllEventListeners() : void;

	}
}