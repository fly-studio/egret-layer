namespace layer.ui {
	class BitmapUI extends egret.Bitmap {
		constructor(resName:string) {
			super();
			this.texture = RES.getRes(resName);
		}
	}
}