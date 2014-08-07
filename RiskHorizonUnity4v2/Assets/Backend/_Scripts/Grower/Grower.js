#pragma strict

class Grower extends TimeScalable {
	
	// <debugging>
	private var debug : boolean = false;
	static var gDebugY : int = 60;
	private var myDebugY : int = 60;
	static var gDebugX : int = 300;
	private var myDebugX : int = 300;
	private var selected : boolean = false;
	// </debugging>
	
	class Settings extends System.Object {
		
		private var growerController : GrowerController;
		private var wealthController : WealthController;
		private var index : int;
		
		function get GController () { return growerController; }
		function get WController () { return wealthController; }
		function get Index () { return index; }
		
		function Settings (_growerController : GrowerController, _wealthController : WealthController, _index : int) {
			growerController = _growerController;
			wealthController = _wealthController;
			index = _index;
		}
	}
	
	class Development extends System.Object {
		
		private var settings : Settings;
		
		private var buildAction : BuildAction = BuildAction.Idle;
		
		private var version : int = 0;
		private var versionCount : int = 7;
		private var totalCost : int = 0;		// Total amount of wealth invested in the building
		private var buildCosts : int[];
		private var buildTimes : float[];
		
		private var devRates : float[] = new float[8]; //[ 0.0, 0.33, 0.4, 0.5, 0.6, 0.725, 0.85, 1.0 ];
		private var devRate : float = 0.0;
		private var buildRate : float = 0.33;
		
		private var coverage : float = 0.0;		// Cost of coping is a fraction of coverage
		private var severity : float = 0.0;
		
		private var damaged : boolean = false;
		private var copeCost : int = 0;
		private var copeTime : float = 0.0;
		private var health : float = 1.0;
		private var recoverableDev : float = 0.0;
		
		function get Version () { return version; }
		function get FullyDeveloped () {
			if (GameController.instance.tutorialLevel) return version >= 2;
			return version >= versionCount - 1; 
		}
		function get Action () { return buildAction; }
		function get Idling () { return buildAction == BuildAction.Idle; }
		function get Damaged () { return damaged; }
		function get Coverage () { return coverage; }
		function set Coverage (value : float) { coverage = value; }
		function get CopeCost () { return copeCost; }
		function get CopeTime () { return copeTime; }
		function get Health () { return health; }
		
		private var hasSnapshot : boolean = false;
		private var snapBuildAction : BuildAction = BuildAction.Idle;
		private var snapVersion : int = 0;
		private var snapTotalCost : int = 0;
		private var snapDamaged : boolean = false;
		private var snapCopeCost : int = 0;
		private var snapCopeTime : float = 0.0;
		private var snapHealth : float = 1.0;
		private var snapRecoverableDev : float = 0.0;
		
		public function get HasSnapshot () : boolean { return hasSnapshot; }
		
		function Development (_settings : Settings, _coverage : float) {
			settings = _settings;
			coverage = _coverage;
			SetDevRates ();
			InitBuildCosts ();
			InitBuildTimes ();
		}
		
		private function SetDevRates () {
			devRates = ArrayCurve (1.5, versionCount);
			/*for (var i = 0; i < devRates.Length; i ++) {
				Debug.Log (devRates[i]);
			}*/
		}
		
		private function InitBuildCosts () {
			buildCosts = new int[versionCount];
			var bc : float[] = ArrayCurve (1.25, versionCount, WealthController.WealthValue (0.85));
			for (var i = 0; i < bc.Length; i ++) {
				buildCosts[i] = Mathf.RoundToInt (bc[i]);
				//buildCosts[i] = 1; //Debugging
			}
			buildCosts[0] = WealthController.WealthValue (0.2);
		}
		
		private function InitBuildTimes () {
			buildTimes = ArrayCurve (1.25, versionCount, TimeController.TimeValue (0.5));
			buildTimes[0] = TimeController.TimeValue (0.1);
			/*for (var i = 0; i < buildTimes.Length; i ++) {
				Debug.Log (buildTimes [i]);
			}*/
			//buildTimes = [ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 ]; //Debugging
		}
		
		private function ArrayCurve (pow : float, length : int) : float [] {
			return ArrayCurve (pow, length, 1.0);
		}
		
		private function ArrayCurve (pow : float, length : int, max : float) : float[] {
			var l : float = length + 0.0;
			var f : float[] = new float[length];
			for (var i = 0; i < length; i ++) {
				f[i] = Mathf.Pow (((i + 1) / l), pow) * max;
			}
			return f;
		}
		
		private function AddCopeTime () {
			var useInsurance : boolean = false;
			var t : float = 0.0;
			for (var i = 0; i < version; i ++) {
				t += buildTimes[i];
			}
			t *= severity;
			if (useInsurance) t *= (1.0 - coverage);
			copeTime += t;
		}
		
		private function AddCopeCost () {
			var c : float = 0.0;
			for (var i = 0; i < version; i ++) {
				c += buildCosts[i];
			}
			c *= severity;
			c *= (1.0 - coverage);
			copeCost += Mathf.FloorToInt (c);
		}
		
		private function StopDevelopment () {
			SetDevelopmentRate (0.0);
		}
		
		private function StartDevelopment () {
			SetDevelopmentRate (1.0);
		}
		
		private function SetDevelopmentRate (r : float) {
			devRate = r;
			settings.GController.SetGrowerRate (settings.Index, devRates[version] * devRate);
		}
		
		private function SetSeverity (s : float) : boolean {
			severity = s;
			// Returns true if damage was bad enough to require fixing
			return Mathf.Round (severity * 10.0) / 10.0 >= 0.01; 
		}
		
		private function StartCoping () : float {
			if (settings.WController.SubtractWealth (copeCost)) {
				copeCost = 0;
				buildAction = BuildAction.Cope;
				return copeTime;
			}
			return 0.0;
		}
		
		private function StartBuilding () : float {
			
			if (version >= versionCount - 1) return 0.0;
			
			var c : int = buildCosts[version];
			
			// The game controller takes care of the initial cost of building
			var build : boolean = false;
			if (version == 0) build = true;
			else {
				if (settings.WController.SubtractWealth (c)) {
					build = true;
				}
			}
			
			if (build) {
				if (version == 0) buildAction = BuildAction.Build;
				else buildAction = BuildAction.Upgrade;
				version ++;
				
				totalCost += c;
				settings.GController.SetGrowerCost (settings.Index, totalCost);
				
				return buildTimes[version - 1];
			}
			return 0.0;
		}
		
		// -------------------- Public functions -------------------- //
		
		public function GetNextVersionCost () : int {
			if (version >= versionCount - 1) return -1;
			return buildCosts[version];
		}
		
		public function ShockHit (s : float, recoverable : float) : int {
			if (SetSeverity (s)) {
				damaged = true;
				buildAction = BuildAction.Idle;
				AddCopeCost ();
				AddCopeTime ();
				SetDevelopmentRate (1.0 - severity);
				health *= (1.0 - severity);
				recoverableDev += recoverable * coverage;
				return copeCost;
			}
			return 0;
		}
		
		public function ResetDamage () {
			if (!damaged) return;
			damaged = false;
			copeCost = 0;
			copeTime = 0.0;
			SetDevelopmentRate (1.0);
			health = 1.0;
			recoverableDev = 0.0;
		}
		
		public function StartAction () : float {
			
			if (!Idling) return 0.0;
			
			var time : float = 0.0;
			if (damaged) {
				time = StartCoping ();
			} else {
				time = StartBuilding ();
			}
			
			if (time > 0.0) SetDevelopmentRate (buildRate); 
			return time;
		}
		
		public function StopAction (time : float, elapsedTime : float, action : BuildAction) {
			//																				// hack
			var completed : boolean = Mathf.Approximately (time, elapsedTime) || elapsedTime + 0.1 > time;
			
			switch (action) {
				case BuildAction.Build:
				case BuildAction.Upgrade: 
					if (damaged && !completed) 
						copeTime += time - elapsedTime; 
					break;
				case BuildAction.Cope: 
					if (completed) {
						damaged = false;
						copeTime = 0.0;
						health = 1.0;
						GameController.instance.AddDevelopment (recoverableDev);
						recoverableDev = 0.0;
					} else {
						copeTime -= elapsedTime;
					}
					break;
			}
			buildAction = BuildAction.Idle;
			StartDevelopment ();
		}
		
		public function TakeSnapshot () {
			snapBuildAction = buildAction;
			snapVersion = version;
			snapTotalCost = totalCost;
			snapDamaged = damaged;
			snapCopeCost = copeCost;
			snapCopeTime = copeTime;
			snapHealth = health;
			snapRecoverableDev = recoverableDev;
			hasSnapshot = true;
		}
		
		public function ResetToSnapshot () : boolean[] {
			var damBuild : boolean[] = [false, false];
			//buildAction = snapBuildAction; // Idle, Build, Upgrade, Cope
			if (snapBuildAction == BuildAction.Build || snapBuildAction == BuildAction.Upgrade || snapBuildAction == BuildAction.Cope) {
				damBuild[1] = true;
			}
			buildAction = snapBuildAction;
			version = snapVersion;
			totalCost = snapTotalCost;
			damaged = snapDamaged;
			copeCost = snapCopeCost;
			copeTime = snapCopeTime;
			health = snapHealth;
			recoverableDev = snapRecoverableDev;
			damBuild[0] = damaged;
			return damBuild;
		}
		
		public function BuildOnReset () {
			SetDevelopmentRate (buildRate);
		}
	}
	
	private var settings : Settings;
	private var development : Development;
	private var growerSprite : GrowerSprite = null;
	private var id : int = 0;
	
	public enum BuildAction { Idle, Build, Upgrade, Cope }
	private var buildProgress : float = 0.0;
	
	private var resetTime : float = 0.0;
	private var resetETime : float = 0.0;
	private var resetFullTime : float = 0.0;
	private var snapshotCount : int = 0;
	
	public function get BuildProgress () : float { return buildProgress; }
	public function get ID () : int { return id; }
	
	function Start () {
		InitTimeScalable ();
	}
	
	public function Create (_debug : boolean, _id : int, 
							growerController : GrowerController,
							wealthController : WealthController,
							coverage) {
		
		// <debugging>
		/*if (index == 5) {
			gDebugY = 60;
		}
		if (index > 4) {
			gDebugX = 450;
			myDebugX = gDebugX;
		}
		debug = _debug;
		myDebugY = gDebugY;
		gDebugY += 60;*/
		// </debugging>
		
		id = _id;
		settings = new Settings (growerController, wealthController, id);
		development = new Development (settings, coverage);
		
		StartBuilding ();
	}
	
	public function GetDevelopment () : Development {
		return development;
	}
	
	public function SetGrowerSprite (_growerSprite : GrowerSprite) {
		growerSprite = _growerSprite;
	}
	
	public function StartBuilding () : boolean {
		var time : float = development.StartAction ();
		if (time > 0.0) {
			SendBuildAction ();
			StartCoroutine (CoBuild (time));
			return true;
		}
		return false;
	}
	
	private function SendBuildAction () {
		GameController.instance.ReceiveBuildAction (development.Action, id);
	}
	
	private function CoBuild (time : float) {
		
		resetFullTime = time;
		var eTime : float = 0.0;
		var action : BuildAction = development.Action;
		
		while (eTime < time && development.Action == action) {
			if (GameState.TimePassing ()) {
				eTime += Time.deltaTime * timeScale;
				buildProgress = Mathf.InverseLerp (0.0, time, eTime);
			}
			yield;
		}
		
		StopBuilding (time, eTime, action);
	}
	
	private function StopBuilding (time : float, eTime : float, action : BuildAction) {
		development.StopAction (time, eTime, action);
		GameController.instance.FinishGrowerAction (this, action);
		if (growerSprite == null) return;
		growerSprite.OnStopBuilding (time, eTime, action);
	}
	
	public function SetInsuranceCoverage (coverage : float) {
		development.Coverage = coverage;
	}
	
	public function ShockDamage (severity : float, recoverableDev : float) : int {
		var cost : int = development.ShockHit (severity, recoverableDev);
		if (cost > 0) {
			if (growerSprite != null)
				growerSprite.OnShockDamage ();
		}
		return cost;
	}
	
	public function ResetDamage () {
		development.ResetDamage ();
		if (growerSprite == null) return;
		growerSprite.OnStopBuilding (1.0, 1.0, BuildAction.Cope);
	}
	
	public function Reset () {
		growerSprite.Reset ();
		PoolManager.instance.Destroy (gameObject);
	}
	
	public function IsDamaged () : boolean {
		return development.Damaged;
	}
	
	public function GetVersion () : int {
		return development.Version;
	}
	
	public function ResetLevel () {
		if (!development.HasSnapshot) {
			Reset ();
		} else {
			var damBuild : boolean[] = development.ResetToSnapshot ();
			if (damBuild[0]) {
				growerSprite.OnShockDamage ();
			} else {
				growerSprite.OnStopBuilding (1.0, 1.0, BuildAction.Upgrade);
			}
			if (damBuild[1]) {
				development.BuildOnReset ();
				growerSprite.StartBuilding ();
				StartCoroutine (CoBuild (resetTime));
			}
		}
	}
	
	public function StartLevel () {
		if (snapshotCount < GameController.instance.GetLevel ()) {
			development.TakeSnapshot ();
			if (development.Action == BuildAction.Build || development.Action == BuildAction.Cope || development.Action == BuildAction.Upgrade) {
				resetTime = Mathf.Lerp (resetFullTime, 0.0, buildProgress);
			}
			snapshotCount ++;
		}
	}
	
	// ------------------- debugging ------------------- //
	
	/*function OnGUI () {
		if (!debug) return;
		GUI.color = (!GameState.IsDefault ()) ? Color.white : Color.yellow;
		var l : String = "Level: " + development.Version.ToString();
		var u : String = "";
		if (!development.Idling) {
			u = "Upgrading: " + Mathf.Round (buildProgress * 100).ToString () + "%";
		} else {
			u = "[" + settings.Index.ToString() + "] ";
			if (development.Damaged) {
				u += "Fix: $" + development.CopeCost.ToString ();
			} else {
				var nvc : int = development.GetNextVersionCost ();
				if (nvc > -1)
					u += "Upgrade: $" + nvc.ToString ();
				else
					u = "";
			}
			if (!GameState.IsDefault ()) {
				u = "";
			}
		}
		var d : String = (development.Damaged) ? "Damaged " : "";
		GUI.Label (new Rect (myDebugX, myDebugY, 200, 60), d + "Grower " + settings.Index.ToString() + "\n" + l + "\n" + u);
	}*/
}