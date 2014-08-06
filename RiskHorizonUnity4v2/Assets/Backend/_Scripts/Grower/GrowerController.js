#pragma strict

class GrowerController extends TimeScalable {
	
	public var debug : boolean = true;
	
	public var grower : GameObject;
	public var growerSprite : GameObject;
	
	private var growerMax : int = 9;
	private var growersGO : GameObject[] = new GameObject[0];
	private var growers : Grower[] = new Grower[0];
	
	private var devRate : float = 0.0;					// Percentage of growerMax (the highest development rate is equal to the maximum number of growers)
	private var growerRates : float[] = new float[0];
	private var growerCosts : int[] = new int[0];
	
	private var insuranceCoverage : float = 0.0;
	private var compensationRate : float = 0.45;		// Percentage of cost of buildings compensated when level begins
	
	private var cost : int;
	private var defaultCost : int;
	public function get Cost () { return cost; }
	
	private var shownTutorial : boolean = false;
	
	function Start () {
		InitTimeScalable ();
		cost = WealthController.WealthValue (0.2);
		defaultCost = cost;
		if (GameController.instance.tutorialLevel) { cost = 0; }
	}
	
	public function SetCostDefault () {
		cost = defaultCost;
	}
	
	public function CanCreateGrower () : boolean {
		return growersGO.Length < growerMax;
	}
	
	function CreateGrower (wealthController : WealthController, id : int) : Grower {
		PoolManager.instance.Instantiate (grower, Vector3.zero, Quaternion.identity);
		growersGO = PoolManager.instance.GetObjects (grower);
		var gs : Grower = UpdateGrowers ();
		gs.Create (debug, id, this, wealthController, insuranceCoverage);
		SetGrowersValue ();
		if (!shownTutorial) Invoke ("OpenTutorial", 0.5);
		return gs;
	}
	
	private function OpenTutorial () {
		GameController.instance.OpenTutorial ("Development");
		shownTutorial = true;
	}
	
	private function UpdateGrowers () : Grower {
		growers = new Grower[growersGO.Length];
		for (var i = 0; i < growers.Length; i ++) {
			growers[i] = growersGO[i].GetComponent (Grower);
		}
		return growers[growers.Length - 1];
	}
	
	private function DestroyGrowers () {
		for (var i = 0; i < growers.Length; i ++) {
			growers[i].Reset ();
		}
		growersGO = new GameObject[0];
		growers = new Grower[0];
		growerRates = new float[0];
		growerCosts = new int[0];
	}
	
	public function SetInsuranceCoverage (coverage : float) {
		insuranceCoverage = coverage;
		for (var i = 0; i < growers.Length; i ++) {
			growers[i].SetInsuranceCoverage (coverage);
		}
	}
	
	public function ShockDamage (severity : float, lostDevelopment : float) : int {
		var totalCost : int = 0;
		var recoverableDev : float = lostDevelopment / (growers.Length + 0.0);
		for (var i = 0; i < growers.Length; i ++) {
			totalCost += growers[i].ShockDamage (severity, recoverableDev);
		}
		return totalCost;
	}
	
	public function SetGrowerRate (index : int, r : float) {
		if (index + 1 > growerRates.Length) {
			growerRates = AppendArray (growerRates, r);
		} else {
			growerRates[index] = r;
		}
		SetDevRate ();
	}
	
	public function SetGrowerCost (index : int, c : float) {
		if (index + 1 > growerCosts.Length) {
			growerCosts = AppendArray (growerCosts, c);
		} else {
			growerCosts[index] = c;
		}
		SetGrowersValue ();
	}
	
	public function GetGrower (index : int) {
		if (index > growers.Length - 1) return null;
		return growers[index];
	}
	
	private function SetDevRate () {
		var totalDev : float = 0.0;
		for (var i = 0; i < growerRates.Length; i ++) {
			totalDev += growerRates[i];
		}
		devRate = totalDev / (growerMax + 0.0);
		GameController.instance.SetGrowersRate (devRate);
	}
	
	private function SetGrowersValue () {
		var v : int = 0;
		for (var i = 0; i < growerCosts.Length; i ++) {
			v += growerCosts[i];
		}
		v *= compensationRate;
		v = Mathf.RoundToInt (v);
		GameController.instance.SetGrowersValue (v);
	}
	
	public function FixAllGrowers () {
		for (var i = 0; i < growers.Length; i ++) {
			growers[i].ResetDamage ();
		}
	}
	
	public function AllGrowersFixed () : boolean {
		for (var i = 0; i < growers.Length; i ++) {
			if (growers[i].IsDamaged ()) return false;
		}
		return true;
	}
	
	public function Reset () {
		DestroyGrowers ();
		SetDevRate ();
		SetGrowersValue ();
	}
	
	public function ResetLevel () {
		for (var i = 0; i < growers.Length; i ++) {
			growers[i].ResetLevel ();
		}
		growersGO = PoolManager.instance.GetObjects (grower);
		for (i = 0; i < growers.Length; i ++) {
			// TODO index out of range error:
			if (i >= growersGO.Length) break;
			if (growersGO[i] == null) continue;
			growers[i] = growersGO[i].GetComponent (Grower);
		}
		SetDevRate ();
		SetGrowersValue ();
	}
	
	public function StartLevel () {
		SetInsuranceCoverage (0.0);
		for (var i = 0; i < growers.Length; i ++) {
			growers[i].StartLevel ();
		}
	}
	
	public function GetGrowerLevels () : int [] {
		var growerLevels : int[] = new int[growers.Length];
		for (var i : int = 0 ; i < growers.Length; i++){
			growerLevels[i] = growers[i].GetVersion();
		}
		return growerLevels;
	}
	
	private function AppendArray (arr : float[], newVal : float) : float[] {
		var newLength : float = arr.Length + 1;
		var newArr : float[] = new float[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
	
	private function AppendArray (arr : int[], newVal : int) : int[] {
		var newLength : int = arr.Length + 1;
		var newArr : int[] = new int[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
	
	// -------------------- Debugging -------------------- //
	
	/*function OnGUI () {
		if (!debug) return;
		GUI.Label (new Rect (300, 20, 200, 60), "[G] Create a Grower: $200");
	}*/
}
