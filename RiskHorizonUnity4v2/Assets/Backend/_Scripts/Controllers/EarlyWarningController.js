#pragma strict

class EarlyWarningController extends MonoBehaviour {
	
	// <debugging>
	public var debug : boolean = true;
	// </debugging>
	
	public var wave : Wave;
	public var cutscene : ShockCutscene;
	
	static var maxTime : float = 0.0;
	private var minProgress : float = 0.25;
	private var duration : float = 0.0;
	private var minDuration : float = 0.0;
	private var elapsedTime : float = 0.0;
	private var remainingTime : float = 0.0;
	private var countingDown : boolean = false;
	
	private var totalCost : float;
	private var unitCost : int;
	private var rate : float;
	private var multiplier : float = 1.0;
	private var multiplierAmount : float = 0.05;
	private var multiplying : boolean = false;
	private var severity : float = 0.0;
	
	public function get MinTime () : float { return minDuration; }
	public function get MaxTime () : float { return maxTime; }
	public function get MinProgress () : float { return minProgress; }
	public function get RemainingTime () : float { return remainingTime; }
	public function get Multiplier () : float { return multiplier; }
	
	function Awake () {
		wave = Instantiate (wave);
		cutscene = Instantiate (cutscene);
	}
	
	function Start () {
		maxTime = TimeController.TimeValue (0.2);
		minDuration = TimeController.TimeValue (0.02);
		rate = 1.0 / maxTime;
		totalCost = WealthController.WealthValue (0.5);
		unitCost = Mathf.FloorToInt (totalCost / maxTime);
	}
	
	public function StartCountdown (progress : float, _severity : float) : float {
		multiplier = 1.0;
		severity = _severity;
		SetMultiplierGoal ();
		duration = Mathf.Max (minDuration, maxTime * progress);
		StartCoroutine (CoCountdown ());
		return duration;
	}
	
	private function SetMultiplierGoal () {
		var protection : float = GameController.instance.GetProtection ();
		var multiplierGoal : float = (severity - protection);
		//TODO this math
	}
	
	public function SkipToEnd () {
		EndCountdown ();
	}

	private function CoCountdown () {
		if (countingDown) return;
		countingDown = true;
		while (countingDown) {
			if (!GameState.CheckState (State.Tutorial)) {
				elapsedTime += Time.deltaTime;
			}
			remainingTime = duration - elapsedTime;
			if (remainingTime <= 0.0) {
				remainingTime = 0.0;
				EndCountdown ();
				countingDown = false;
			}
			yield;
		}
	}
	
	private function EndCountdown () {
		elapsedTime = 0.0;
		GameController.instance.EndEarlyWarningCountdown ();
		cutscene.StartCutscene ();
		var seconds : float = (GameController.instance.IsDamaged ()) ? 5.0 : 2.5;
		yield WaitForSeconds (seconds);
		cutscene.StopCutscene ();
		yield WaitForSeconds (0.5);
		GameController.instance.EndEarlyWarning ();
	}
	
	public function Pause () {
		countingDown = false;
	}
	
	public function Resume () {
		StartCoroutine (CoCountdown ());
	}
	
	public function StartMultiplier () {
		multiplying = true;
		StartCoroutine (CoAddMultiplier ());
	}
	
	public function StopMultiplier () {
		multiplying = false;
	}
	
	public function AddMultiplier () {
		multiplier += multiplierAmount;
		GameController.instance.UpdateEarlyWarningMultiplier (0);
		if (GameController.instance.GetTotalProtection () >= 0.99) {
			EndCountdown ();
			countingDown = false;
		}
	}
	
	public function ResetMultiplier () {
		multiplier = 1.0;
	}
	
	private function CoAddMultiplier () {
		var secs : int = 1;
		var time : float = 0.0;
		while (multiplying) {
			time += Time.deltaTime;
			if (time >= secs) {
				if (GameController.instance.UpdateEarlyWarningMultiplier (unitCost)) {
					multiplier += rate;
				}
				secs ++;
			}
			yield;
		}
	}
	
	// <debugging>
	/*function OnGUI () {
		if (!debug) return;
		if (!countingDown) return;
		GUI.color = Color.yellow;
		var m : int = Mathf.FloorToInt (remainingTime / 60.0);
		var s : int = Mathf.FloorToInt (remainingTime - m * 60.0);
		var t : String = String.Format ("{0:0}:{1:00}", m, s);
		var multi : float = Mathf.Round(multiplier * 100.0);
		var multis : String = "\nProtection x " + multi.ToString () + "%";
		GUI.Label (new Rect (100, 20, 200, 60), "Early Warning: " + t + multis);
	}*/
	// </debugging>
}