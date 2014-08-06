#pragma strict

class LandBackground extends GameSprite {
	
	function Start () {
		SetDefaultDimensions (1536, 1152);
		//SetDefaultDimensions (768, 576);
		InitGameSprite (10, -0.4);
		//SpriteTransform.position.y = (MainCamera.GetTargetHeight () - DefaultHeight) * -0.5;
		SpriteTransform.position = MainCamera.AnchorLowerRight (DefaultWidth, DefaultHeight, Depth);
	}
}