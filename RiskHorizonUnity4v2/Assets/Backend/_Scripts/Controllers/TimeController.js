#pragma strict

// Setting time should be done using the TimeValue () function, which sets the time to a % of the DURATION constant

class TimeController extends MonoBehaviour {
	
	public var debug : boolean = true;
	
	static var DURATION : float = 180.0;		// Duration in seconds of current level
	static var timeScale : float = 1.0;			// How fast time is passing (as a percentage). 1 = normal speed. 0 = paused.
	
	private var time : float = 0.0;				// Time since level began
	private var remainingTime : float = 0.0;	// Time remaining in level
	private var pauseTimeScale : float = 1.0;	// The time scale before the game was paused
	private var paused : boolean = false;
	private var countingDown : boolean = false;
	
	public function get ElapsedTime () : float { return time; }
	public function get RemainingTime () : float { return remainingTime; }
	
	static function TimeValue (percent : float) : float {
		return DURATION * percent;
	}
	
	private function CoCountdown () {
		if (countingDown) return;
		countingDown = true;
		while (countingDown) {
			time += Time.deltaTime * timeScale;
			remainingTime = DURATION - time;
			if (remainingTime <= 0.0) {
				remainingTime = 0.0;
				countingDown = false; // if anything gets fucked up w/ time, switch this line w/ the one below it
				EndCountdown ();
			}
			yield;
		}
	}
	
	function EndCountdown () {
		GameController.instance.EndLevel ();
	}
	
	public function PauseCountdown () {
		countingDown = false;
	}
	
	public function ResumeCountdown () {
		StartCoroutine (CoCountdown ());
	}
	
	public function Pause () {
		if (paused) return;
		pauseTimeScale = timeScale;
		timeScale = 0.0;
		Messenger.instance.Send ("time scale set");
		paused = true;
	}
	
	public function Resume () {
		if (!paused) return;
		timeScale = pauseTimeScale;
		Messenger.instance.Send ("time scale set");
		paused = false;
	}
		
	public function RestartCountdown () {
		time = 0.0;
		remainingTime = DURATION - time;
		StartCoroutine (CoCountdown ());
	}
	
	public function StartLevel () {
		if (GameController.instance.tutorialLevel) return;
		RestartCountdown ();
	}
	
	// -------------------- Debugging -------------------- //
	
	/*function OnGUI () {
		if (!debug) return;
		var m : int = Mathf.FloorToInt (remainingTime / 60.0);
		var s : int = Mathf.FloorToInt (remainingTime - m * 60.0);
		var t : String = String.Format ("{0:0}:{1:00}", m, s);
		var tScale : String = "\nTime scale: " + Mathf.RoundToInt (timeScale * 100.0).ToString () + "%";
		GUI.Label (new Rect (20, 20, 200, 50), "Time: " + t);
		GUI.Label (new Rect (20, 660, 200, 40), tScale);
	}*/
	
	function Update () {
		if (Input.GetKeyDown (KeyCode.Q)) {
			timeScale = 40.0;
			Messenger.instance.Send ("time scale set");
		}
		
		if (Input.GetKeyDown (KeyCode.W)) {
			timeScale = 1.0;
			Messenger.instance.Send ("time scale set");
		}
	}
}