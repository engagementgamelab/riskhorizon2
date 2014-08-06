#pragma strict

class Shock extends TimeScalable {
	
	// <debugging>
	public var debug : boolean = false;
	static var shockDebugX : float = 20;
	private var myDebugX : float;
	static var shockDebugY : float = 400;
	private var myDebugY : float;
	static var shockIndex : int = 0;
	private var myIndex : int;
	// </debugging>
	
	private var shockController : ShockController;
	private var attributes : ShockAttributes;
	
	private var remainingTime : float;
	private var viewing : boolean = false;
	private var earlyWarningTime : float = 0.0;
	
	private var progress : float = 0.0;
	private var hit : boolean = false;
	private var missed : boolean = false;
	
	public function get Progress () : float { return progress; }
	public function get Hit () : boolean { return hit; }
	public function get Missed () : boolean { return missed; }
	
	public function get Attributes () : ShockAttributes { return attributes; }
	
	function Start () {
		InitTimeScalable ();
	}
	
	function Create (_shockController : ShockController, _shockAttributes : ShockAttributes) {
		
		UpdateTimeScale ();
		
		shockController = _shockController;
		attributes = _shockAttributes;
		earlyWarningTime = 0.0;
		
		missed = false;
		hit = false;
		
		StartCoroutine (CoCountdown ());
		
		// <debugging>
		myDebugX = shockDebugX;
		myDebugY = shockDebugY;
		if (shockDebugX < 600) {
			shockDebugX += 150;
		} else {
			shockDebugY += 80;
			shockDebugX = 20;
		}
		
		myIndex = shockIndex;
		shockIndex ++;
		// </debugging>
	}
	
	function CoCountdown () {
		var eTime : float = 0.0;
		while (eTime < attributes.Duration) {
			if (!GameState.CheckState (State.EarlyWarning)) {
				eTime += Time.deltaTime * timeScale;
				progress = eTime / attributes.Duration;
				remainingTime = attributes.Duration - eTime;
				if (remainingTime <= 0.0) {
					remainingTime = 0.0;
					Impact ();
				}
			}
			yield;
		}
	}
	
	function Impact () {
		hit = shockController.Impact (attributes);
		if (!hit) {
			shockController.Missed (attributes);
			missed = true;
		}
		StopViewing ();
		PoolManager.instance.Destroy (gameObject);
	}
	
	public function StartViewing () {
		if (viewing || hit || missed) return;
		viewing = true;
		StartCoroutine (CoWatch ());
	}
	
	public function StopViewing () {
		viewing = false;
	}
	
	function CoWatch () {
		while (viewing && attributes.EarlyWarningProgress < 1.0) {
			earlyWarningTime += Time.deltaTime * timeScale;
			attributes.EarlyWarningProgress = (earlyWarningTime / EarlyWarningController.maxTime);
			yield;
		}
	}
	
	// -------------------- Debugging -------------------- //
	
	function OnGUI () {
		if (!debug) return;
		
		// <BackendWithScene>
		if (!viewing) return;
		myDebugX = 660;
		myDebugY = 420;
		// </BackendWithScene>
		
		GUI.color = (viewing) ? Color.yellow : Color.white;
		
		var sev : int = Mathf.RoundToInt (attributes.GetSeverityEstimate () * 10.0);
		var sevs : String = "\nSeverity: " + sev.ToString ();
		var c : int = Mathf.RoundToInt (attributes.GetHitProbabilityEstimate () * 100.0);
		var chance : String = "\nChance of hit: " + c + "%";
		var e : int = Mathf.RoundToInt (attributes.EarlyWarningProgress * 100.0);
		var ew : String = "\nEarly Warning: " + e + "%";
		
		if (hit) {
			sev = Mathf.RoundToInt (attributes.Severity * 10.0);
			sevs = "\nSeverity: " + sev.ToString ();
			c = Mathf.RoundToInt (attributes.HitProbability * 100.0);
			chance = "\nChance of hit: " + c + "%";
			GUI.Label (new Rect (myDebugX, myDebugY, 200, 80), myIndex + " HIT!" + sevs + chance);
			return;
		}
		
		if (missed) {
			sev = Mathf.RoundToInt (attributes.Severity * 10.0);
			sevs = "\nSeverity: " + sev.ToString ();
			c = Mathf.RoundToInt (attributes.HitProbability * 100.0);
			chance = "\nChance of hit: " + c + "%";
			GUI.Label (new Rect (myDebugX, myDebugY, 200, 80), myIndex + " missed!" + sevs + chance);
			return;
		}
		
		var m : int = Mathf.FloorToInt (remainingTime / 60.0);
		var s : int = Mathf.FloorToInt (remainingTime - m * 60.0);
		var time : String = String.Format ("{0:0}:{1:00}", m, s);
		var t : String = "\nTime until hit: " + time;
		
		if (!viewing || !GameState.CheckState (State.Knowledge)) {
			t = "";
			sevs = "";
			chance = "";
		}
		
		GUI.Label (new Rect (myDebugX, myDebugY, 200, 100), "[" + myIndex + "] Shock!!" + t + sevs + chance + ew);
	}
}