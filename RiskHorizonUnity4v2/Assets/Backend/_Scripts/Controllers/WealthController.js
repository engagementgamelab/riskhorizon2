#pragma strict

// Any costs in the game should be set using the WealthValue () function
// This sets the cost relative to the WEALTH_MIN constant

class WealthController extends TimeScalable {
	
	// Debug
	public var debug : boolean = true;
	private var noFunds : boolean = false;
	// End debug
	
	static var WEALTH_MIN : float = 1000.0;
	private var wealth : float = 0.0;
	
	private var collectingIncome : boolean = false;
	private var income : int = 0;
	private var incomePeriod : float = 5.0;	// Time in seconds between each income payout
	
	private var growersValue : int = 0;
	private var levelStartWealth : int;
	
	function get Wealth () { return wealth; }
	//function set Wealth (value : int) { wealth = value; }
	
	function Start () {
		InitTimeScalable ();
		wealth = WEALTH_MIN;
		UpdateIncome ();
		Messenger.instance.Send ("wealth updated");
	}
	
	static function WealthValue (percent : float) : int {
		return Mathf.RoundToInt (WEALTH_MIN * percent);
	}
	
	public function AddWealth (amount : float) {
		wealth += amount;
		Messenger.instance.Send ("wealth updated");
	}
	
	public function SubtractWealth (amount : float) : boolean {
		if (Mathf.Approximately (amount, 0.0)) return true;
		if (wealth - amount >= 0) {
			wealth -= amount;
			Messenger.instance.Send ("wealth updated");
			return true;
		}
		if (GameController.instance.tutorialLevel) {
			if (wealth < 100) {
				AddWealth (200.0);
				return true;
			}
		}
		noFunds = true;
		Messenger.instance.Send ("wealth insufficient");
		CancelInvoke ("ResetMessage");
		Invoke ("ResetMessage", 3.0);
		return false;
	}
	
	public function SetGrowersValue (v : int) {
		growersValue = v;
		UpdateIncome ();
	}
	
	private function UpdateIncome () {
		income = Mathf.RoundToInt ((WEALTH_MIN + growersValue) / (TimeController.DURATION / incomePeriod));
	}
	
	private function CoAddIncome () {
		collectingIncome = true;
		var time : float = 0.0;
		while (collectingIncome) {
			if (GameState.TimePassing ()) {
				time += Time.deltaTime * timeScale;
				if (time >= incomePeriod) {
					AddIncome ();
					time = 0.0;
				}
			}
			yield;
		}
	}
	
	function AddIncome () {
		AddWealth (income);
	}
	
	public function ResetLevel () {
		wealth = levelStartWealth;
	}
	
	public function StartLevel () {
		if (GameController.instance.tutorialLevel) return;
		levelStartWealth = wealth;
		StartAddIncome ();
	}
	
	public function StartAddIncome () {
		StartCoroutine (CoAddIncome ());
	}
	
	public function EndLevel () {
		collectingIncome = false;
	}
	
	public function Reset () {
		wealth = WEALTH_MIN;
	}
	
	// -------------------- Debugging -------------------- //
	function ResetMessage () {
		noFunds = false;
	}
	
	/*function Update () {
		if (Input.GetKeyDown (KeyCode.K)) {
			AddWealth (1000);
		}
	}*/
	
	/*function OnGUI () {
		if (!debug) return;
		var w : int = Mathf.RoundToInt (wealth);
		GUI.Label (new Rect (20, 40, 200, 50), "Wealth: $" + w);
		if (noFunds) GUI.Label (new Rect (600, 60, 200, 50), "Not enough wealth!");
	}*/
}