#pragma strict

class LandFrontPiece extends GameSprite {
	
	function Start () {
		SetDefaultDimensions (1536, 1152);
		InitGameSprite (10, -0.6);
		//SpriteTransform.position.y = (MainCamera.GetTargetHeight () - DefaultHeight) * -0.5;
		SpriteTransform.position = MainCamera.AnchorLowerRight (DefaultWidth, DefaultHeight, Depth);
	}
}