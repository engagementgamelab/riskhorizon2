#pragma strict

class TelescopeDisplay extends GameSprite {
	
	function Awake () {
		//Hide ();
	}
	
	function Start () {
		InitGameSprite (5, -0.1);
		myTransform.position = MainCamera.SetPositionV3 (-0.25 * MainCamera.scale, 0.0, Depth, true, true);
		//gameObject.SetActiveRecursively (false);
	}
	
	public function SetDisplay (meteor : Meteor) {
		SetTexture (meteor.TextureIndex);
		//FadeIn (0.25);
	}
	
	/*public function HideDisplay () {
		FadeOut (0.25);
	}*/
	
	/*public function OnEndFade (a : float) {
		if (a < 0.1) gameObject.SetActiveRecursively (false);
	}*/
}