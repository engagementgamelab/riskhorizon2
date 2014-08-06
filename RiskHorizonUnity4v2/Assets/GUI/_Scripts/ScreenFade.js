#pragma strict

class ScreenFade extends GameSprite {
	
	private var level : int = -1;
	private var deactivateOnEndFade : boolean = true;
	
	function Start () {
		InitGameSprite (0, 0.1);
		SetColor (Color.black);
		while (GetScale () < MainCamera.GetTargetWidth ()) {
			SetScale (GetScale () * 2.0, false);
		}
		Show ();
		FadeOut (1.0);
	}
	
	public function ScreenFadeIn (time : float, _level : int) {
		ScreenFadeIn (time, _level, true);
	}
	
	public function ScreenFadeIn (time : float, _level : int, doef : boolean) {
		FadeIn (time);
		level = _level;
		deactivateOnEndFade = doef;
	}
	
	public function OnEndFade (alpha : float) {
		if (level > -1) Application.LoadLevel (level);
		else {
			if (deactivateOnEndFade) gameObject.SetActive (false);
		}
	}
}