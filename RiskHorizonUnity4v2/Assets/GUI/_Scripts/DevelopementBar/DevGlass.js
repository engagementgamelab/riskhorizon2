#pragma strict

class DevGlass extends GameSprite {
	
	function Awake () {
		SetDefaultDimensions (1024, 1024);
	}
	
	function Start () {
		InitGameSprite (4, 0.3);
		myTransform.position = MainCamera.SetPositionV3 (-0.9, 0.1, Depth, false); //MainCamera.SetPositionV3 (-1.15, 0.1, Depth);
	}
}