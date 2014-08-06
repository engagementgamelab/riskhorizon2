#pragma strict

class Lift extends GameSprite {
	
	function Start () {
		InitGameSprite (10, -0.5);
		//SpriteTransform.position.y = (MainCamera.GetTargetHeight () - DefaultHeight) * -0.5;
		SpriteTransform.position = MainCamera.AnchorLowerRight (DefaultWidth, DefaultHeight, Depth);
	}
}