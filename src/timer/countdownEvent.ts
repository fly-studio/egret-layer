namespace layer.timer {
	export class CountdownEvent extends egret.Event {
		static START = "START";
		static STOP = "STOP";
		static RESET = "RESET";
		static COUNTDOWN = "COUNTDOWN";
		static PAUSE = "PAUSE";
		static RESUME = "RESUME";

		public duration: number = 0;
		public remaining: number;

		public static dispatchCountdownEvent(target: egret.IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean): boolean {
			let event = egret.Event.create(CountdownEvent, type, bubbles, cancelable);
			event.duration = (target as layer.timer.Countdown).duration;
			event.remaining = (target as layer.timer.Countdown).remaining;
			let result = target.dispatchEvent(event);
			egret.Event.release(event);
			return result;
		}
	}
}
