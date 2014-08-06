#pragma strict

class MiniGameClock extends GameText {
	
	private var countingDown : boolean = false;
	
	function Awake () {
		InitGameText (0, 0.0);
	}
	
	function Start () {
		transform.position = MainCamera.SetPositionScreenSpace (0.0, -0.8);
		SetFont (FontContainer.instance.GetLarge ());
		SetMaterial (FontContainer.instance.GetLargeRed ());
		gameObject.SetActive (false);
	}
	
	public function StartCountdown () {
		StartCoroutine (CoCountdown ());
	}
	
	private function CoCountdown () {
		if (countingDown) return;
		countingDown = true;
		var time : float = GameController.instance.GetEarlyWarningTime ();
		while (time > 0.0 && countingDown) {
			time = GameController.instance.GetEarlyWarningTime ();
			
			var minutes : int = time / 60;
			var seconds : int = time % 60;
			var t = minutes + ":" + ((seconds < 10 ? "0" : "") + seconds); 
			SetText (t.ToString ());
			
			yield;
		}
	}
	
	public function StopCountdown () {
		countingDown = false;
	}
	
	public function Pause () {
		countingDown = false;
	}
	
	public function Resume () {
		StartCoroutine (CoCountdown ());
	}
}