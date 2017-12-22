namespace layer.ui {
	export class MovieClip extends egret.MovieClip
	{
		constructor(resName: string, group: string)
		{
			let factory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(RES.getRes(resName + '_json'), RES.getRes(resName + '_png'));
			let data: egret.MovieClipData = factory.generateMovieClipData(group);
			super(data);
		}
	}
}