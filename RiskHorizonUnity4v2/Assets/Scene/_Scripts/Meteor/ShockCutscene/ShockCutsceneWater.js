#pragma strict

class ShockCutsceneWater extends ShockCutscenePart {
	
	private var time : float = 0.0;
	private var startX : float;
	private var distance : float;
	
	function Start () {
		InitGameSprite (3, -0.1);
		SpriteTransform.position = MainCamera.SetPositionV3 (0.0, -0.6, Depth, true);
		startX = SpriteTransform.position.x;
		distance = MainCamera.GetHeight () * 0.25;
		Hide ();
	}
	
	function Update () {
		time += Time.deltaTime;
		var angle : float = Mathf.Sin (time);
		myTransform.position.x = startX + (angle * distance);
	}
}