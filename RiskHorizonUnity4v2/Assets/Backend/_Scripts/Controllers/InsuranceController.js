#pragma strict

class InsuranceController extends MonoBehaviour {
	
	// <debugging>
	public var debug : boolean = true;
	private var keyCodes : KeyCode[] = [ KeyCode.Alpha1, KeyCode.Alpha2, KeyCode.Alpha3 ];
	// </debugging>
	
	private var planCount : int = 3;
	private var premiums : int[] = new int[3];	// Cost of plans
	private var coverages : float[];			// Percentage covered in case of shock
	private var growersValue : int = 0;
	private var purchasedPlan : int = -1;
	
	private var coverage : float = 0.0;
	
	public function get Premiums () : int[] { return premiums; }
	public function get Coverages () : float[] { return coverages; }
	public function get Coverage () : float { return coverage; }
	public function get Plan () : int { return purchasedPlan; }
	
	function Start () {
		coverages = [ 0.33, 0.50, 0.75 ];
	}
	
	public function SetGrowersValue (w : int) {
		growersValue = w;
	}
	
	private function SetPremiums () {
		
		var minimums : float[] = [ 0.05, 0.125, 0.175 ];
		var p : float = (growersValue + 0.0 * 0.5) / (WealthController.WEALTH_MIN + 0.0);
		
		for (var i = 0; i < premiums.Length; i ++) {
			premiums[i] = WealthController.WealthValue (minimums[i] + (minimums[i] * p));
		}
	}
	
	public function GetPremium (plan : int) : int {
		return premiums[plan];
	}
	
	public function Purchase (plan : int) {
		purchasedPlan = plan;
		coverage = coverages[purchasedPlan];
	}
	
	function ResetInsurance () {
		purchasedPlan = -1;
		coverage = 0.0;
	}
	
	public function StartLevel () {
		ResetInsurance ();
		SetPremiums ();
	}
	
	// -------------------- Debugging -------------------- //

	/*function OnGUI () {
		if (!debug) return;
		//GUI.color = (GameState.CheckState (State.Insurance)) ? Color.yellow : Color.white;
		if (!GameState.CheckState (State.Insurance)) return;
		var p : String = "";
		for (var i = 0; i < planCount; i ++) {
			var plan = i;
			var c : float = coverages[i] * 100;
			p += "\n[" + plan.ToString () + "] Plan " + plan.ToString () + ": $" + premiums[i].ToString () + ", coverage: " + c.ToString () + "%";
		}
		if (!GameState.CheckState (State.Insurance)) p = "";
		
		var pp : String = "\n";
		var pps : int = purchasedPlan;
		if (purchasedPlan > -1) pp += "Current plan: " + pps.ToString ();
		//GUI.Label (new Rect (20, 280, 200, 80), "[I] Insure" + p + pp);
		GUI.Label (new Rect (400, 300, 200, 80), "Insure" + p + pp);
	}*/
}