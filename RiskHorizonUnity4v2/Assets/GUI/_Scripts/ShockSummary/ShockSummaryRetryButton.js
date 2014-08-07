#pragma strict

class ShockSummaryRetryButton extends GameButton {
	
	public var large : Texture[] = new Texture[3];
	public var small : Texture[] = new Texture[3];
	
	private var buttons : Texture[];
	private var summary : ShockSummary2;
	
	public function Create (_summary : ShockSummary2) {
		InitGameSprite (1, -0.1);
		var scale : float = MainCamera.scale;
		SpriteTransform.position = MainCamera.SetPositionV3 (1.5 * scale, -1.05 * scale, Depth, true, true);
		//if (UseSmallScreen ()) {
			buttons = small;
		//} else {
		//	buttons = large;
		//}
		hotkey = KeyCode.Return;
		summary = _summary;
		SetTextures (buttons);
	}
	
	public function Show (won : boolean) {
		if (won) return;
		gameObject.SetActive (true);
	}
	
	public function OnSelect () {
		GameController.instance.ResetLevel ();
		summary.OnReset ();
	}
}