#pragma strict

class IntroTextBackground extends GameSprite {
	
	function Awake () {
		InitGameSprite (1, 0.0);
	}
	
	public function Destroy () {
		FadeOut (0.25);
	}
	
	public function OnEndFade (alpha : float) {
		if (alpha < 0.1) {
			gameObject.SetActiveRecursively (false);
		}
	}
}