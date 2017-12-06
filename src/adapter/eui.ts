namespace layer.adapter {
	export function registerEUI()
	{
		//inject the custom material parser
		//注入自定义的素材解析器
		let assetAdapter = new layer.adapter.AssetAdapter();
		egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
		egret.registerImplementation("eui.IThemeAdapter", new layer.adapter.ThemeAdapter());
	}
}