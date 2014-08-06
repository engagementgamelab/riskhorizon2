#pragma strict

class Scaffolding extends GameSprite {
	
	private var fade : float = 0.25;
	
	function Awake () {
		InitGameSprite (7, 0.0, true);
		Hide ();
	}
	
	public function Create (layer : int, offset : float) {
		SetZPosition (layer, offset, false);
		FadeIn (fade);
	}
	
	public function Destroy () {
		FadeOut (fade);
	}
	
	public function OnEndFade (alpha : float) {
		if (alpha < 0.1) {
			PoolManager.instance.Destroy (gameObject);
		}
	}
}