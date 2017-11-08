namespace layer.ui {
	export function alert(message: string, callback?: Function) : Promise<void> {
		return new Promise<void>((resolve: (value?:any) => void, reject: (reason?: any) => void) => {
			let ui:layer.ui.TipUI = new layer.ui.TipUI();
			ui.title = '提示';
			ui.content = message;
			ui.buttons = [{
				text: 'OK',
				onClick: () => {
					ui.destroy();
					if (callback instanceof Function)
						callback.call(this);
					resolve();
				}
			}];
			ui.addToStage();
		});
	}

	export function confirm(message: string, confirmed?: Function, canceled?: Function) : Promise<void> {
		return new Promise<void>((resolve: (value?:any) => void, reject: (reason?: any) => void) => {
			let ui:layer.ui.TipUI = new layer.ui.TipUI();
			ui.title = '请求';
			ui.content = message;
			ui.buttons = [{
				text: '取消',
				onClick: () => {
					ui.destroy();
					if (canceled instanceof Function)
					canceled.call(this);
					reject();
				}
			},{
				text: '确定',
				onClick: () => {
					ui.destroy();
					if (confirmed instanceof Function)
						confirmed.call(this);
					resolve();
				}
			}];
			ui.addToStage();
		});
	}
}
