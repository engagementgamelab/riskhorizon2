#pragma strict

class TelescopeBack extends GameSprite {
	
	function Awake () {
		InitGameSprite (5, 0.2);
		//Hide ();
	}
	
	function Start () {
		myTransform.position = MainCamera.SetPositionV3 (0.0, -0.125, Depth, true);
		gameObject.SetActiveRecursively (false);
	}
	
	public function ShowDisplay () {
		FadeIn (0.25);
	}
	
	public function HideDisplay () {
		FadeOut (0.25);
	}
	
	public function OnEndFade (a : float) {
		if (a < 0.1) gameObject.SetActiveRecursively (false);
	}
}