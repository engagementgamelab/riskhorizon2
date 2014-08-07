#pragma strict

class ShockCutsceneGrower extends ShockCutscenePart {
	
	function Start () {
		InitGameSprite (3, -0.2);
		transform.position = MainCamera.SetPositionV3 (0.0, 0.05, transform.position.z, false);
		Hide ();
	}
}