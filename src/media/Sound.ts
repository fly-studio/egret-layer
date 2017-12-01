namespace layer.media {

	export class Sound {
		public static play(resName: string, loops: number = 1) : egret.SoundChannel | null
		{
			let sound: egret.Sound = RES.getRes(resName);
			return sound ? sound.play(0, loops) : null;
		}
	}
}
