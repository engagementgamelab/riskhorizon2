#pragma strict

class ShockController extends TimeScalable {
	
	class LevelShocks extends System.Object {
		
		private var shockCount : int;
		private var creationTimes : float[];
		
		private var durations : float[];
		private var severities : float[];
		private var severityDeviation : float = 0.1;
		private var hitProbabilities : float[];
		private var hitDeviation : float = 0.1;
		
		public function get ShockCount () { return shockCount; }
		
		public function LevelShocks (minCount : int, _severities : float[], _hitProbabilities : float[]) {
			
			shockCount = Random.Range (minCount, _severities.Length + 1);
			severities = new float[shockCount];
			hitProbabilities = new float[shockCount];
			
			for (var i = 0; i < shockCount; i ++) {
				severities[i] = Mathf.Clamp01 (Deviate (_severities[i], severityDeviation));
				hitProbabilities[i] = Mathf.Clamp01 (Deviate (_hitProbabilities[i], hitDeviation));
			}
			
			SetTimes ();
			ShuffleShocks ();
		}
		
		public function LevelShocks (minCount : int, _severities : float[], _hitProbabilities : float[], _creationTimes : float[], _durations : float[]) {
			
			shockCount = minCount;
			severities = new float[shockCount];
			hitProbabilities = new float[shockCount];
			creationTimes = new float[shockCount];
			durations = new float[shockCount];
			
			for (var i = 0; i < shockCount; i ++) {
				severities[i] = _severities[i];
				hitProbabilities[i] = _hitProbabilities[i];
				creationTimes[i] = _creationTimes[i];
				durations[i] = _durations[i];
			}
		}
		
		public function GetShockAttributes (shock : int) : ShockAttributes {
			return new ShockAttributes (durations[shock], severities[shock], hitProbabilities[shock]);
		}
		
		public function GetCreationTime (shock : int) : float {
			return creationTimes[shock];
		}
		
		private function SetTimes () {
			
			var startTime : float = 10.0;	 	// Earliest a shock can hit
			var endTime : float = 5.0;			// Latest a shock can hit
			var recoverTime : float = 10.0;		// Minimum time between shocks
			
			var shockFreeTime : float = (startTime + endTime + (recoverTime * (shockCount - 1)));	// Total time without shocks
			var separation = (TimeController.DURATION - shockFreeTime) / (shockCount + 0.0);		// Maximum time between shocks
			var deviation : float = separation / 2;													// Variation in time between shocks
			
			durations = new float[shockCount];
			creationTimes = new float[shockCount];
			
			for (var i = 0; i < shockCount; i ++) {
				var hitTime : float = startTime + ((i + 1) * separation) + (i * recoverTime);
				if (i == shockCount - 1) {
					hitTime = Deviate (hitTime, -deviation, 0);
				} else {
					hitTime = Deviate (hitTime, deviation);
					hitTime = Mathf.Max (hitTime, startTime + separation);
				}
				creationTimes[i] = Random.Range (startTime, hitTime - separation);
				durations[i] = hitTime - creationTimes[i];
			}
		}
		
		private function Deviate (val : float, d : float) : float {
			return Deviate (val, -d, d);
		}
		
		private function Deviate (val : float, min : float, max : float) : float {
			return val + Random.Range (min, max);
		}
		
		private function ShuffleShocks () {
			
			// Shuffle an array of ints
			var ints : int[] = new int[shockCount];
			for (var i = 0; i < shockCount; i ++) {
				ints[i] = i;
			}
			for (i = shockCount - 1; i > 0; i --) {
				var j : int = Mathf.FloorToInt (Random.value * (i + 1.0));
				var temp : int = ints[i];
				ints[i] = ints[j];
				ints[j] = temp;
			}
			
			// Move the indices of the severities and hitProbabilities arrays to match the shuffled ints
			var tempS : float[] = new float[severities.Length];
			var tempH : float[] = new float[hitProbabilities.Length];
			for (i = 0; i < shockCount; i ++) {
				tempS[i] = severities[ints[i]];
				tempH[i] = hitProbabilities[ints[i]];
				
			}
			severities = tempS;
			hitProbabilities = tempH;
		}
	}
	
	// <debugging>
	public var debug : boolean = true;
	private var noShocks : boolean = false;
	// </debugging>
	
	public var meteorController : MeteorController;
	public var shock : GameObject;
	public var shockReports : ShockReports;
	public var shockSummary : ShockSummary;
	public var shockSummary2 : ShockSummary2;
	
	private var tutorialShocks : LevelShocks;
	private var levelShocks : LevelShocks[];
	private var createdShocks : int[] = new int[0];
	private var shockOrder : int[];
	private var shockIndex : int = 0;
	private var level : int = 0;
	private var cost : int = 0;
	
	private var shockCount : int = 0;
	private var landedCount : int = 0;
	private var hitCount : int = 0;
	
	private var tutorialLevel : boolean = false;
	private var lastCreatedShock : Shock;
	
	public function get Cost () : int { return cost; }
	public function get LandedCount () : int { return landedCount; }
	public function get LastCreatedShockAttributes () : ShockAttributes { return lastCreatedShock.Attributes; }
	
	function Awake () {
		InitLevelShocks ();
		if (meteorController != null) {
			meteorController = Instantiate (meteorController);
		}
		shockReports = Instantiate (shockReports);
		shockSummary2 = Instantiate (shockSummary2);
	}
	
	function Start () {
		InitTimeScalable ();
		cost = WealthController.WealthValue (0.005);
	}
	
	private function InitLevelShocks () {
		
		tutorialShocks = new LevelShocks (4, [0.2, 0.4, 0.8, 0.8],
											 [0.0, 1.0, 1.0, 1.0],
											 [1.0, 2.0, 3.0, 4.0],
											 [15.0, 30.0, 15.0, 15.0]);
		
		levelShocks = new LevelShocks[9];
		
		levelShocks[0] = new LevelShocks (3, [0.1, 0.2, 0.5, 0.1], 
											 [0.8, 0.1, 0.9, 0.2]);
		
		//Uncomment for stupidly easy level 1
		//levelShocks[0] = new LevelShocks (3, [0.1, 0.2, 0.5, 0.1],
		//									 [0.0, 0.0, 0.0, 0.0]);
		
		levelShocks[1] = new LevelShocks (4, [0.1, 0.2, 0.7, 0.4, 0.1], 
											 [0.3, 0.3, 0.9, 0.6, 0.1]);
											 
		levelShocks[2] = new LevelShocks (4, [0.1, 0.2, 0.8, 0.4, 0.1, 0.3], 
											 [0.5, 0.2, 0.9, 0.7, 0.4, 0.5]);
											 
		levelShocks[3] = new LevelShocks (4, [0.1, 0.4, 0.8, 0.6, 0.1, 0.6], 
											 [0.2, 0.4, 0.9, 0.3, 0.7, 0.4]);
		
		levelShocks[4] = new LevelShocks (5, [0.3, 0.1, 1.0, 0.5, 0.4, 0.4, 0.2], 
											 [0.8, 0.4, 0.8, 0.7, 0.3, 0.2, 0.8]);
											 
		levelShocks[5] = new LevelShocks (6, [0.3, 0.5, 1.0, 0.6, 0.3, 0.3, 0.2, 0.5], 
											 [0.8, 0.4, 0.9, 0.8, 0.2, 0.4, 0.7, 0.3]);
											 											 
		levelShocks[6] = new LevelShocks (5, [0.2, 0.1, 1.0, 0.9, 0.3, 0.4, 0.2], 
											 [0.8, 0.4, 0.6, 0.7, 0.2, 0.2, 0.8]);
		
		levelShocks[7] = new LevelShocks (5, [0.2, 0.1, 1.0, 0.9, 0.3, 0.4, 0.2], 
											 [0.8, 0.4, 0.6, 0.7, 0.2, 0.2, 0.8]);											 
											 
		levelShocks[8] = new LevelShocks (5, [0.2, 0.1, 1.0, 0.9, 0.3, 0.4, 0.2], 
											 [0.8, 0.4, 0.6, 0.7, 0.2, 0.2, 0.8]);
	}
	
	private function CreateShocks () {
		
		// <debugging>
		if (noShocks) return;
		// </debugging>
		
		if (tutorialLevel) {
			levelShocks[0] = tutorialShocks;
		}
		
		landedCount = 0;
		hitCount = 0;
		
		var ls : LevelShocks = levelShocks[level];
		shockCount = ls.ShockCount;
		var creationTimes : float[] = new float[shockCount];
		for (var i = 0; i < shockCount; i ++) {
			if (tutorialLevel) break;
			var time : float = ls.GetCreationTime (i);
			TSInvoke ("CreateShock", time);
			creationTimes[i] = time;
		}
		
		shockOrder = new int[0];
		var prevValue : float = 0.0;
		while (shockOrder.Length < shockCount) {
			var val : float = Mathf.Infinity;
			var index : int = 0;
			for (var j = 0; j < shockCount; j ++) {
				var t : float = ls.GetCreationTime (j);
				if (t > prevValue && t < val) {
					val = t;
					index = j;
				}  
			}
			shockOrder = AppendArray (shockOrder, index);
			prevValue = val;
		}
	}
	
	function ShockCreated (index : int) : boolean {
		if (createdShocks.Length == 0) return false;
		for (var i = 0; i < createdShocks.Length; i ++) {
			if (createdShocks[i] == index) return true;
		}
		return false;
	}
	
	public function CreateShockAtIndex (index : int) : GameObject {
		// This function is specifically used for the tutorial
		shockIndex = index;
		landedCount = index;
		return CreateShock ();
	}
	
	function CreateShock () : GameObject {
		var meteor : GameObject;
		var index : int = shockOrder[shockIndex];
		var s : GameObject = PoolManager.instance.Instantiate (shock, Vector3.zero, Quaternion.identity);
		s.transform.parent = transform;
		lastCreatedShock = s.GetComponent (Shock);
		lastCreatedShock.Create (this, levelShocks[level].GetShockAttributes (index));
		if (meteorController != null) {
			meteor = meteorController.CreateMeteor (s.GetComponent (Shock));
		}
		createdShocks = AppendArray (createdShocks, index);
		shockIndex ++;
		GameController.instance.OpenTutorialInGameText ("Meteor");
		return meteor;
	}
	
	public function Impact (attributes : ShockAttributes) : boolean {
		var hit : boolean = false;
		if (!GameController.instance.ShockCanHit ()) {
			return false;
		}
		
		if (Random.value < attributes.HitProbability) {
			GameController.instance.ShockHit (attributes);
			hitCount ++;
			hit = true;
		}
		
		// If all other shocks have missed, make the last one hit
		if (landedCount == shockCount - 1 && hitCount == 0) {
			GameController.instance.ShockHit (attributes);
			hit = true;
		}
		landedCount ++;
		return hit;
	}
	
	public function Missed (attributes : ShockAttributes) {
		GameController.instance.ShockMissed (attributes);
	}
	
	public function GetShock (index : int) : Shock {
		var shocks : GameObject[] = PoolManager.instance.GetObjects (shock);
		if (shocks.Length == 0 || index > shocks.Length - 1) return null;
		var s = shocks[index].GetComponent (Shock);
		if (s.Hit || s.Missed) return null;
		return s;
	}
	
	public function StopViewingShocks (exception : Shock) {
		var shocks : GameObject[] = PoolManager.instance.GetObjects (shock);
		for (var i = 0; i < shocks.Length; i ++) {
			var s : Shock = shocks[i].GetComponent (Shock);
			if (s == exception) continue;
			s.StopViewing ();
		}
	}
	
	// GameController calls the next two functions
	public function ShockMissed (level : int, attributes : ShockAttributes, protection : float, insurance : int) {
		shockReports.AddReport (level, false, attributes, protection, insurance);
	}
	
	public function ShockDamage (level : int, attributes : ShockAttributes, protection : float, insurance : int, multiplier : float, damage : float, copeCost : int) {
		shockReports.AddReport (level, true, attributes, protection, insurance, multiplier, damage, copeCost);
	}
	
	public function StartLevel (_level : int, _tutorialLevel : boolean) {
		// <debugging>
		Shock.shockDebugX = 20;
		Shock.shockDebugY = 400;
		Shock.shockIndex = 0;
		// </debugging>
		level = _level - 1;
		tutorialLevel = _tutorialLevel;
		shockIndex = 0;
		createdShocks = new int[0];
		CreateShocks ();
		shockReports.Reset ();
	}
	
	public function EndLevel (won : boolean) {
		PoolManager.instance.DestroyAll (shock);
		shockSummary2.Activate ();
		shockSummary2.Show (shockReports.GetReports (), won);
	}
	
	function Update () {
		if (Input.GetKeyDown (KeyCode.Z)) {
			shockSummary2.Activate ();
			shockSummary2.Show (
				shockReports.GetReportsTest (), 
				(Mathf.RoundToInt (Random.Range (0, 2)) == 1)
			);
		}
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
}