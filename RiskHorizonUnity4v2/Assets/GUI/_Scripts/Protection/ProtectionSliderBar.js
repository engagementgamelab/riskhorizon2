#pragma strict

class ProtectionSliderBar extends GameSprite {
	
	function Start () {
		InitGameSprite (6, -0.1);
		SpriteTransform.localPosition.x = 90.0 * MainCamera.scale;
	}
}