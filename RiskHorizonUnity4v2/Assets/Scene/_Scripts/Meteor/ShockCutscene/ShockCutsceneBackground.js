#pragma strict

class ShockCutsceneBackground extends ShockCutscenePart {
	
	public var backLeft : ShockCutsceneBackgroundSide;
	public var backRight : ShockCutsceneBackgroundSide;
	
	function Start () {
		var scale : float = MainCamera.scale;
		backLeft.transform.position.x = -1024 * scale;
		backRight.transform.position.x = 1024 * scale;
	}
	
	public function Hide () {
		backLeft.Hide ();
		backRight.Hide ();
	}
	
	public function OnEnable () {
		backLeft.gameObject.SetActive (true);
		backRight.gameObject.SetActive (true);
	}
	
	public function FadeIn (time : float) {
		backLeft.FadeIn (time);
		backRight.FadeIn (time);
	}
	
	public function FadeOut (time : float) {
		backLeft.FadeOut (time);
		backRight.FadeOut (time);
	}
	
	public function OnEndFade (a : float) {
		if (a < 1.0) {
			backLeft.gameObject.SetActive (false);
			backRight.gameObject.SetActive (false);
			gameObject.SetActive (false);
		}
	}
}