#pragma strict

class Village extends TimeScalable {
	
	// Village raises with protection
	
	private var protection : float = 0.0;
	private var yMin : float;
	private var yMax : float;
	
	function Start () {
		InitTimeScalable ();
		Messenger.instance.Listen ("update protection", this);
		yMin = transform.position.y;
		yMax = transform.position.y + MainCamera.GetHeight () * 0.33;
	}
	
	private function UpdateProtection (p : float) {
		if (p > protection) {
			protection = p;
			OnSetProtection ();
		} else {
			Lower (p);
		}
	}
	
	private function OnSetProtection () {
		transform.position.y = Mathf.Floor (Mathf.Lerp (yMin, yMax, protection));
	}
	
	private function Lower (endProtection : float) {
		StartCoroutine (CoLower (endProtection));
	}
	
	private function CoLower (endProtection : float) {
		
		var time : float = 0.5;
		var eTime : float = 0.0;
		var startProtection : float = protection;
		
		while (eTime < time) {
			eTime += Time.deltaTime * timeScale;
			protection = Mathf.Lerp (startProtection, endProtection, Mathf.SmoothStep (0.0, 1.0, eTime / time));
			OnSetProtection ();
			yield;
		}
	}
	
	function _UpdateProtection () {
		UpdateProtection (GameController.instance.GetTotalProtection ());
	}
}
