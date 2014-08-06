#pragma strict

class MiniGameOverlaySide extends GameSprite {
	
	function Start () {
		InitGameSprite (6, 0.1);
		gameObject.SetActive (false);
	}
	
	public function OnEndFade (a : float) {
		if (a < 1.0) gameObject.SetActive (false);
	}
}