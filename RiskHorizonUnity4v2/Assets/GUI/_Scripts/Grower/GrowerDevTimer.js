#pragma strict

class GrowerDevTimer extends GameSprite {
	
	private var fade : float = 0.25;
	
	function Awake () {
		InitGameSprite (7, -0.1, true);
		Hide ();
	}
	
	public function Create (layer : int, offset : float) {
		SetZPosition (layer, offset, false);
		FadeIn (fade);
	}
	
	public function SetProgress (progress : float) {
		var t : int = Mathf.FloorToInt (progress * (TextureCount - 1.0));
		SetTexture (t);
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