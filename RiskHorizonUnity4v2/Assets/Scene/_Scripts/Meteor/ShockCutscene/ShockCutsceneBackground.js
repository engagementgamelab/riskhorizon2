#pragma strict

class ShockCutsceneBackground extends ShockCutscenePart {
	
	function Start () {
		InitGameSprite (3, -0.15);
		Hide ();
	}
}