#pragma strict

class MiniGameOverlay extends MonoBehaviour {
	
	public var overlayLeft : MiniGameOverlaySide;
	public var overlayRight : MiniGameOverlaySide;
	
	function Start () {
		var scale : float = MainCamera.scale;
		overlayLeft.transform.position.x = -1024 * scale;
		overlayRight.transform.position.x = 1024 * scale;
	}
	
	public function SetOverlayActive (a : boolean) {
		overlayLeft.gameObject.SetActive (a);
		overlayRight.gameObject.SetActive (a);
	}
	
	public function FadeOverlayIn (time : float) {
		overlayLeft.FadeIn (time);
		overlayRight.FadeIn (time);
	}
	
	public function FadeOverlayOut (time : float) {
		overlayLeft.FadeOut (time);
		overlayRight.FadeOut (time);
	}
	
	public function OnEndFade (a : float) {
		if (a < 1.0) gameObject.SetActive (false);
	}
}