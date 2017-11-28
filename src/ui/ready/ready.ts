namespace layer.ui {
	export interface ReadyRes {
		imageRes: string;
		soundRes: string;
		duration?: number;
	}
	export abstract class Ready extends layer.ui.Sprite {

		protected _readyReses: ReadyRes[];

		public set readyRes(value: ReadyRes[]) {
			this._readyReses = value;
		}

		public get readyRes(): ReadyRes[] {
			return this._readyReses;
		}

		constructor()
		{
			super();

			this._readyReses = [];
		}

		public abstract animating(): Promise<any>;
	}
}