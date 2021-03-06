#pragma strict

class ShockSummaryInfoBox extends GameSprite {
	
	function Create (layer : int) {
		InitGameSprite (layer, -0.1);
	}
	
	public function Show (report : ShockReport) {
		if (report.Hit) {
			SetTexture (0);
		} else {
			SetTexture (1);
		}
		SpriteTransform.position = MainCamera.SetPositionV3 (0.0, 0.05, Depth, true);
	}
}