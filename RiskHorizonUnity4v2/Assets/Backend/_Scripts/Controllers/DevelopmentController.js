#pragma strict

class DevelopmentController extends TimeScalable {
	
	public var debug : boolean = true;
	
	private var developing : boolean = false;
	private var development : float = 0.0;
	private var maxDevelopment : float;
	private var developmentProgress : float = 0.0;	// Percentage (development/maxDevelopment)
	
	private var rate : float = 0.0;					// Dev increase per second
	private var rateGoals : float[] = new float[9]; //[ 0.067, 0.15, 0.25, 0.45, 0.75 ];	// Average rate required to reach the dev goal (this makes the dev goals time independent)
	private var devGoals : float[];					// Percentage
	private var devGoal : float;
	private var rateGoal : float;
	private var devGoalProgress : float = 0.0;
	private var targetRate : float;
	
	private var protectionRate : float = 0.1;		// How much protecting should slow development
	private var slowRate : float = 1.0;				// When e.g. adding protection, change this rate to slow development
	
	private var goalReached : boolean = false;
	
	private var levelStartDevelopment : float;
	
	function get DevProgress () : float { return developmentProgress; }
	function get DevGoal () : float { return devGoal; }
	function get DevGoals () : float[] { return devGoals; }
	function get DevRate () : float { return rate * slowRate; }
	function get DevRateGoal () : float { return rateGoal; }
	function get DevGoalProgress () : float { return devGoalProgress; }
	function get TargetRate () : float { return targetRate; };
	
	function Awake () {
		SetRateGoals ();
		SetGoals ();
	}
	
	function Start () {
		InitTimeScalable ();
	}
	
	private function SetRateGoals () {
		var length : float = (rateGoals.Length + 0.0);
		var pow : float = 1.33;
		for (var i = 0; i < rateGoals.Length; i ++) {
			rateGoals[i] = Mathf.Pow ((i + 1) / length, pow);
			//Debug.Log ("rate goals: " + rateGoals[i]);
		}
	}
	
	private function SetGoals () {
		
		var goalCount : int = rateGoals.Length;
		var devTimeGoals = new float[goalCount];
		
		maxDevelopment = 0;
		for (var i = 0; i < goalCount; i ++) {
			devTimeGoals[i] = TimeController.TimeValue (rateGoals[i]);
			if (i > 0) devTimeGoals[i] += (devTimeGoals[i - 1]);
			//Debug.Log ("dev time goals: " + devTimeGoals[i]);
		}
		maxDevelopment = devTimeGoals[goalCount - 1];
		//Debug.Log ("max development: " + maxDevelopment);
		
		devGoals = new float[goalCount];
		for (i = 0; i < goalCount; i ++) {
			devGoals[i] = devTimeGoals[i] / maxDevelopment;
			//Debug.Log ("dev goals: " + devGoals[i]);
		}
	}
	
	public function AddDevelopment (d : float) {
		development += d;
	}
	
	public function StartDeveloping () {
		StartCoroutine (CoDevelop ());
	}
	
	public function StopDeveloping () {
		developing = false;
	}
	
	private function CoDevelop () {
		if (developing) return;
		developing = true;
		while (developing) {
			if (GameState.TimePassing ()) {
				development += rate * slowRate * Time.deltaTime * timeScale;
				developmentProgress = Mathf.InverseLerp (0.0, maxDevelopment, development);
				devGoalProgress = developmentProgress / devGoal; 
				//Debug.Log (devGoalProgress + " = " + developmentProgress + " / " + devGoal);
				targetRate = ((devGoal * maxDevelopment) - development) / Mathf.Max (1.0, GameController.instance.GetTime ());
				if (!goalReached) {
					if (devGoalProgress >= 1.0) {
						GameController.instance.DevGoalReached ();
						goalReached = true;
					}
				} else {
					if (devGoalProgress < 1.0) {
						goalReached = false;
					}
				}
			}
			yield;
		}
	}
	
	public function SetRate (r : float) {
		rate = r;
	}
	
	public function ResetLevel () {
		development = levelStartDevelopment;
	}
	
	public function StartLevel (level : int, tutorialLevel : boolean) {
		if (tutorialLevel) {
			rateGoal = 0.033;
			var devTimeGoal : float = TimeController.TimeValue (rateGoal);
			devGoal = devTimeGoal / maxDevelopment;
		} else {
			devGoal = devGoals[level - 1];
			rateGoal = rateGoals[level - 1];
		}
		levelStartDevelopment = development;
		StartDeveloping ();
	}
	
	public function EndLevel () {
		StopDeveloping ();
	}
	
	public function GetGoalReached () : boolean {
		return (developmentProgress >= devGoal);
	}
	
	public function ShockDamage (severity : float) : float {
		var preShockDev : float = development;
		development *= (1.0 - severity);
		
		// Returns how much was lost
		return preShockDev - development;
	}
	
	public function StartProtection () {
		slowRate = protectionRate;
	}
	
	public function StopProtection () {
		slowRate = 1.0;
	}
	
	public function Reset () {
		development = 0;
	}
	
	// ------------------ Debugging ------------------ //
	
	/*function OnGUI () {
		if (!debug) return;
		var goal : float = (Mathf.Round (devGoal * 1000.0) / 1000.0) * 100.0;
		var d : float = (Mathf.Round (developmentProgress * 1000.0) / 1000.0) * 100.0;
		var r : float = rate * slowRate;
		
		GUI.color = (r > 0.01) ? Color.white : Color.red;
		GUI.Label (new Rect (20, 60, 200, 50), GUIContent ("Dev Goal: " + goal + "%\nDevelopment: " + d.ToString () + "%\nRate: " + r.ToString () + " %/s"));
	}*/
}