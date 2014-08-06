#pragma strict

class ScreenFade extends GameSprite {
	
	private var level : int = -1;
	
	function Start () {
		InitGameSprite (0, 0.0);
		SetColor (Color.black);
		while (GetScale () < MainCamera.GetTargetWidth ()) {
			SetScale (GetScale () * 2.0, false);
		}
		Show ();
		FadeOut (1.0);
	}
	
	public function ScreenFadeIn (time : float, _level : int) {
		FadeIn (time);
		level = _level;
	}
	
	public function OnEndFade (alpha : float) {
		if (level > -1) Application.LoadLevel (level);
		else gameObject.SetActive (false);
	}
}