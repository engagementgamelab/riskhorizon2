#pragma strict

class WaterBackground extends GameSprite {
	
	function Awake () {
		InitGameSprite (10, -0.2);
	}
	
	function Start () {
		myTransform.position = MainCamera.SetPositionV3 (0.0, -0.25, Depth, false);
	}
}