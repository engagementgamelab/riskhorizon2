#pragma strict

class Plots extends GameSprite {
	
	private var width : float = 0.78;
	
	function Start () {
		InitGameSprite (9, -0.05);
		//myTransform.position = MainCamera.SetPositionV3 (0.5 * width * 0.5, -0.15, Depth, false);
		//SpriteTransform.position.y += (MainCamera.GetTargetHeight () - DefaultHeight) * -0.5;
		var offset : Vector2 = new Vector2 (0.0895, 0.09);
		SpriteTransform.position = MainCamera.AnchorLowerRight (
			DefaultWidth - ((DefaultWidth + 0.0) * offset.x * 2.0), 
			DefaultHeight - ((DefaultHeight + 0.0) * offset.y * 2.0), 
			Depth
		);
	}
}