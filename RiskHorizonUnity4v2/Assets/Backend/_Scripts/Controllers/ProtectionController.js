#pragma strict

class ProtectionController extends TimeScalable {
	
	// <debugging>
	public var debug : boolean = true;
	// </debugging>
	
	private var protection : float = 0.0;			// Percentage
	private var protecting : boolean = false;
	
	private var cost : float;						// Cost per unit
	private var minCost : float;
	private var maxCost : float;
	
	private var rate : float;
	private var minRate : float;
	private var maxRate : float;
	
	private var levelStartProtection : float;
	
	public function get Protection () : float { return protection; }
	public function get Cost () : float { return cost; }
	
	function Start () {
		InitTimeScalable ();
		SetRate ();
		SetCost ();
	}
	
	function SetRate () {
		minRate = 0.05 / TimeController.DURATION;
		maxRate = 0.015 / TimeController.DURATION;
		rate = minRate;
	}
	
	function SetCost () {
		var c1 : float = WealthController.WealthValue (0.33);
		minCost = c1 * rate;
		var c2 : float = WealthController.WealthValue (2.33);
		maxCost = c2 * rate;
	}
	
	public function StartProtection () {
		if (protecting) return;
		protecting = true;
		StartCoroutine (CoAddProtection ());
	}
	
	private function CoAddProtection () {
		while (protecting && protection < 1.0) {
			if (GameController.instance.UpdateProtection (cost * timeScale)) {
				AddProtection ();
			}
			yield;
		}
	}
	
	private function AddProtection () {
		var p : float = Mathf.Pow ((protection / 1.0), 1.5);
		rate = Mathf.Lerp (minRate, maxRate, p);
		SetCost ();
		cost = Mathf.Lerp (minCost, maxCost, p);
		protection += rate * timeScale * Time.deltaTime * 62.5;
	}
	
	public function StopProtection () {
		protecting = false;
	}
	
	function ShockDamage (severity : float) {
		protection *= (1.0 - (severity * 0.25));
	}
	
	public function Reset () {
		protection = 0.0;
	}
	
	public function SetProtection (p : float) {
		protection = p;
		Messenger.instance.Send ("update protection");
	}
	
	public function ResetLevel () {
		SetProtection (levelStartProtection);
	}
	
	public function StartLevel () {
		levelStartProtection = protection;
	}
	
	/*function Update () {
		if (Input.GetKeyDown (KeyCode.E)) {
			for (var i = 0; i < 10; i ++) {
				AddProtection ();
				protection += 0.1;
			}
		}
	}*/
	
	// <debugging>
	/*function OnGUI () {
		if (!debug) return;
		//GUI.color = (GameState.CheckState (State.Protection)) ? Color.yellow : Color.white;
		//if (!GameState.CheckState (State.Protection)) return;
		if (GameState.CheckState (State.Knowledge)) return;
		var c : float = Mathf.Round (cost * 100.0) / 100.0;
		var p : int = Mathf.RoundToInt (protection * 100.0);
		//GUI.Label (new Rect (20, 220, 200, 60), "[P] Protect: $" + c + "\nProtected: " + p + "%");
		GUI.Label (new Rect (820, 620, 200, 200), "Protect: $" + c + "\nProtected: " + p + "%");
	}*/
	// </debugging>
}