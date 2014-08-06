#pragma strict

class BackgroundScreenshot extends GameSprite {
	
	private var	level : int = 1;
	
	function Start () {
		InitGameSprite (0, 0.0);
		Hide ();
	}
	
	public function FadeInLevel (time : float, _level : int) {
		level = _level;
		FadeIn (0.5);
	}
	
	public function OnEndFade (a : float) {
		if (a > 0.9) Application.LoadLevel (level);
	}
}