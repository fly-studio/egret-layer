namespace layer.ui {
	export function alert(message: string): Promise<any> {
		return new Promise<any>((resolve: (value?: any) => any, reject: (reason?: any) => any) => {
			let ui:layer.ui.TipUI = new layer.ui.TipUI();
			ui.title = '提示';
			ui.content = message;
			ui.buttons = [{
				text: 'OK',
				onClick: () => {
					ui.destroy();
					resolve();
				}
			}];
			ui.addToStage();
		});
	}

	export function confirm(message: string): Promise<any> {
		return new Promise<any>((resolve: (value?: any) => any, reject: (reason?: any) => any) => {
			let ui:layer.ui.TipUI = new layer.ui.TipUI();
			ui.title = '请求';
			ui.content = message;
			ui.buttons = [{
				text: '取消',
				onClick: () => {
					ui.destroy();
					reject();
				}
			},{
				text: '确定',
				onClick: () => {
					ui.destroy();
					resolve();
				}
			}];
			ui.addToStage();
		});
	}
}
