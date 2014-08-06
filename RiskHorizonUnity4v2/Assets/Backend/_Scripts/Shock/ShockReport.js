#pragma strict

class ShockReport extends System.Object {
	
	// Game
	private var level : int = 0;
	private var id : int = 0;
	
	// Shock attributes	
	private var hit : boolean = false;
	private var severity : float = 0.0;
	private var hitProbability : float = 0.0;
	
	// Actions
	private var research : float = 0.0;
	private var protection : float = 0.0;
	private var insurance : int = -1;
	
	// Minigame
	private var multiplier : float = 0.0;
	
	// Post mortem
	private var damage : float = 0.0;
	private var copeCost : int = 0;
	
	public function get Severity () : float { return severity; }
	public function get HitProbability () : float { return hitProbability; }
	public function get Research () : float { return research; }
	public function get Protection () : float { return protection; }
	public function get Multiplier () : float { return multiplier; }
	
	public function get Connections () : float { return Mathf.RoundToInt ((multiplier - 1.0) / 0.05); }
	public function get Insurance () : int { return insurance; }
	public function get Damage () : int { return Mathf.RoundToInt (damage * 100.0); }
	public function get CopeCost () : int { return copeCost; }
	
	public function get Hit () : boolean { return hit; }
	public function get Level () : int { return level; }
	public function get ID () : int { return id; }
	
	public function ShockReport (_level : int, _id : int, _hit : boolean, attributes : ShockAttributes, _protection : float, _insurance : int, _multiplier : float, _damage : float, _copeCost : int) {
		level = _level;
		id = _id;
		hit = _hit;
		severity = attributes.Severity;
		hitProbability = attributes.HitProbability;
		research = attributes.EarlyWarningProgress;
		protection = _protection;
		insurance = _insurance;
		multiplier = _multiplier;
		damage = _damage;
		copeCost = _copeCost;
	}
	
	public function TotalCopeCost () : int {
		if (insurance == -1) return copeCost;
		var coverages : float[] = GameController.instance.GetInsuranceCoverages ();
		return Mathf.RoundToInt ((copeCost + 0.0) / (1.0 - coverages[insurance]));
	}
	
	public function GetReport () : String {
		var tempInt : int = Mathf.RoundToInt (severity * 10.0);
		var _severity : 		String = "Severity: " + severity.ToString ();
		tempInt = Mathf.RoundToInt (hitProbability * 100.0);
		var _hitProbability : 	String = "Chance of hit: " + hitProbability.ToString () + "%";
		tempInt = Mathf.RoundToInt (research * 100.0);
		var _research : 		String = "Research: " + research.ToString () + "%";
		tempInt = Mathf.RoundToInt (protection * 100.0);
		var _protection : 		String = "Protection: " + tempInt.ToString () + "%";
		var _insurance : 		String = "Insurance Plan: " + ((insurance > -1) ? "#" + insurance.ToString () : "None");
		tempInt = Mathf.RoundToInt (multiplier * 100.0);
		var _multiplier : 		String = "Early warning multiplier: " + tempInt.ToString () + "%";
		tempInt = Mathf.RoundToInt (damage * 100.0);
		var _damage : 			String = "Damage: " + tempInt.ToString () + "%";
		var _copeCost : 		String = "Cope cost: $" + copeCost.ToString ();
		tempInt = id + 1;
		var _id : 				String = tempInt.ToString ();
		
		if (hit) {
			return "Shock #" + _id + " hit\n" +
					_severity + "\n" +
					_hitProbability + "\n" +
				   	_research + "\n" +
				   	_protection + "\n" +
				   	_multiplier + "\n" +
				   	_insurance + "\n" +
				   	_damage + "\n" +
				   	_copeCost;
		} else {
	   		return "Shock #" + _id + " missed\n" +
	   				_severity + "\n" +
	   				_hitProbability + "\n" +
	   				_research + "\n" +
	   				_protection + "\n" + 
	   				_insurance;
	    }
	}
}