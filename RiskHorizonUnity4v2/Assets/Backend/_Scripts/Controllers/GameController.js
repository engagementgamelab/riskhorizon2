#pragma strict

class GameController extends MonoBehaviour {
	
	public var tutorialLevel : boolean = false;
	
	// Settings
	private var tutorialEnabled : boolean = false;
	//public var smallScreen : boolean = true;
	private var debugText : String = "";
	
	// <debugging>
	public var debugging : boolean = true;
	private var keyCodes : KeyCode[] = [ 
		KeyCode.Alpha0, 
		KeyCode.Alpha1, 
		KeyCode.Alpha2, 
		KeyCode.Alpha3, 
		KeyCode.Alpha4, 
		KeyCode.Alpha5, 
		KeyCode.Alpha6, 
		KeyCode.Alpha7, 
		KeyCode.Alpha8, 
		KeyCode.Alpha9 
	];
	// </debugging>
	
	public var miniGameControl : MiniGameController;
	public var dataController : DataController;
	
	public var audioControl : AudioController;
	public var developmentControl : DevelopmentController;
	public var earlyWarningControl : EarlyWarningController;
	public var growerControl : GrowerController;
	public var insuranceControl : InsuranceController;
	public var knowledgeControl : KnowledgeController;
	public var levelControl : LevelController;
	public var plotControl : PlotController;
	public var protectionControl : ProtectionController;
	public var shockControl : ShockController;
	public var timeControl : TimeController;
	public var tutorialControl : TutorialController;
	public var tutorialControl2 : TutorialController2;
	public var wealthControl : WealthController;
	
	private var won : boolean = false;
	private var hitAttributes : ShockAttributes;	// Attributes of a shock that has hit
	private var paused : boolean = false;
	
	static var instance : GameController;
	
	function get HitAttributes () : ShockAttributes { return hitAttributes; }
	function get Paused () : boolean { return paused; }
	
	function Awake () {
		if (instance == null) instance = this;
		audioControl = Instantiate (audioControl);
		developmentControl = Instantiate (developmentControl);
		earlyWarningControl = Instantiate (earlyWarningControl);
		growerControl = Instantiate (growerControl);
		insuranceControl = Instantiate (insuranceControl);
		knowledgeControl = Instantiate (knowledgeControl);
		levelControl = Instantiate (levelControl);
		plotControl = Instantiate (plotControl);
		protectionControl = Instantiate (protectionControl);
		shockControl = Instantiate (shockControl);
		timeControl = Instantiate (timeControl);
		wealthControl = Instantiate (wealthControl);
		
		if (tutorialEnabled) GameState.SetState (State.Tutorial);
		tutorialControl2.Create (earlyWarningControl, growerControl, miniGameControl, plotControl, protectionControl, shockControl, timeControl, wealthControl);
	}
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		StartLevel ();
		TutorialStartGame ();
		audioControl.StartGame ();
	}
	
	public function PauseTime () {
		timeControl.Pause ();
	}
	
	public function ResumeTime () {
		timeControl.Resume ();
	}
	
	public function Pause () {
		Pause (true);
	}
	
	public function Pause (sendMessage : boolean) {
		PauseTime ();
		paused = true;
		audioControl.Pause ();
		if (sendMessage) Messenger.instance.Send ("game paused");
	}
	
	public function Resume () {
		Resume (true);
	}
	
	public function Resume (sendMessage : boolean) {
		ResumeTime ();
		paused = false;
		audioControl.Resume ();
		if (sendMessage) Messenger.instance.Send ("game resumed");
	}
	
	public function GetWon () : boolean {
		return won;
	}
	
	public function Advance () : boolean {
		// Returns true if going to the next level
		if (GameState.CheckState (State.BetweenLevels)) {
			if (GetLastLevel ()) {
				RestartGame ();
				return false;
			}
			if (won) {
				StartLevel ();
				return true;
			} else {
				RestartGame ();
				return false;
			}
		}
		return true;
	}
	
	// ----------------------- Audio ----------------------- //
	
	public function AudioPlay (i : int) {
		audioControl.Play (i);
	}
	
	public function AudioPlay (clip : AudioClip) {
		audioControl.Play (clip);
	}
	
	public function AudioPlay (clip : String) {
		audioControl.Play (clip);
	}
	
	public function AudioPlayPing () {
		audioControl.PlayPing ();
	}
	
	public function AudioPlayClick1 () {
		audioControl.PlayClick1 ();
	}
	
	public function AudioPlayClick2 () {
		audioControl.PlayClick2 ();
	}
	
	// -------------------- Development -------------------- //
	
	public function GetDevGoal () : float {
		return developmentControl.DevGoal;
	}
	
	public function GetDevGoals () : float[] {
		return developmentControl.DevGoals;
	}
	
	public function GetDevRate () : float {
		return developmentControl.DevRate;
	}
	
	public function GetDevRateGoal () : float {
		return developmentControl.DevRateGoal;
	}
	
	public function GetDevProgress () : float {
		return developmentControl.DevProgress;
	}
	
	public function GetDevGoalProgress () : float {
		return developmentControl.DevGoalProgress;
	}
	
	public function GetDevTargetRate () : float {
		return developmentControl.TargetRate;
	}
	
	public function AddDevelopment (d : float) {
		developmentControl.AddDevelopment (d);
	}
	
	public function DevGoalReached () {
		audioControl.DevGoalReached ();
	}
	
	// ------------------- Early Warning ------------------- //
	
	public function GetEarlyWarningTime () : float {
		return earlyWarningControl.RemainingTime;
	}
	
	public function GetEarlyWarningMultiplier () : float {
		return earlyWarningControl.Multiplier;
	}
	
	public function PauseEarlyWarning () {
		earlyWarningControl.Pause ();
	}
	
	public function ResumeEarlyWarning () {
		earlyWarningControl.Resume ();
	}
	
	public function StartEarlyWarning (progress : float, severity : float) {
		
		// Don't start the minigame if protection is maxed out
		if (GetTotalProtection () >= 0.99 && !tutorialLevel) {
			earlyWarningControl.SkipToEnd ();
			return;
		}
		
		var duration : float = earlyWarningControl.StartCountdown (progress, severity);
		if (duration > 0.0) {
			PauseTime ();
			GameState.SetState (State.EarlyWarning);
			miniGameControl.StartGame ();
			OpenTutorial ("Shock Hit");
			if (tutorialLevel) tutorialControl2.ShockHit ();
		} else {
			EndEarlyWarning ();
		}
	}
	
	public function EndEarlyWarningCountdown () {
		if (tutorialLevel) hitAttributes = tutorialControl2.FudgeHit (hitAttributes); 
		//if (tutorialLevel) tutorialControl2.EndMiniGame ();
		audioControl.ShockWave ();
		miniGameControl.EndGame ();
		Messenger.instance.Send ("play cutscene");
	}
	
	public function EndEarlyWarning () {
		StopEarlyWarningMultiplier ();
		ResumeTime ();
		ShockDamage ();
		GameState.SetStateDefault ();
		Messenger.instance.Send ("stop cutscene");
		if (tutorialLevel) tutorialControl2.EndCutscene ();
	}
	
	public function MiniGameConnectionComplete (cost : float) : boolean {
		// Returns true if there's enough money to make another connection
		var canAdd : boolean = wealthControl.SubtractWealth (cost);
		if (canAdd) {
			earlyWarningControl.AddMultiplier ();
			return (GetTotalProtection () < 0.99);
		}
		return false;
	}
	
	public function StartEarlyWarningMultiplier () {
		earlyWarningControl.StartMultiplier ();
	}
	
	public function StopEarlyWarningMultiplier () {
		earlyWarningControl.StopMultiplier ();
	}
	
	public function UpdateEarlyWarningMultiplier (cost : float) : boolean {
		if (wealthControl.SubtractWealth (cost)) {
			Messenger.instance.Send ("update protection");
			return true;
		}
		return false;
	}
	
	// ----------------------- Grower ---------------------- //
	
	public function SetGrowersRate (r : float) {
		developmentControl.SetRate (r);
	}
	
	public function SetGrowersValue (v : int) {
		wealthControl.SetGrowersValue (v);
		insuranceControl.SetGrowersValue (v);
	}
	
	public function CreateGrower (id : int) : Grower {
		if (!growerControl.CanCreateGrower () || !GameState.CheckState (State.Development)) return null;
		if (wealthControl.SubtractWealth (growerControl.Cost)) {
			if (tutorialLevel) tutorialControl2.BuildGrower ();
			return growerControl.CreateGrower (wealthControl, id);
		}
		return null;
	}
	
	public function BuildGrower (grower : Grower) : boolean {
		if (!GameState.CheckState (State.Development) || grower == null) return false;
		return grower.StartBuilding ();
	}
	
	public function FinishGrowerAction (grower : Grower, action : Grower.BuildAction) {
		audioControl.FinishGrowerAction (grower);
		if (tutorialLevel && action == Grower.BuildAction.Cope) tutorialControl2.FinishRepair ();
	}
	
	public function ReceiveBuildAction (action : Grower.BuildAction, id : int) {
		audioControl.GrowerBuildAction (action, id);
		if (tutorialLevel) tutorialControl2.ReceiveBuildAction (action);
	}
	
	public function GetGrowerLevels () {
		return growerControl.GetGrowerLevels();
	}
	
	// --------------------- Insurance --------------------- //
	
	public function GetInsurancePremiums () : int[] {
		return insuranceControl.Premiums;
	}
	
	public function GetInsuranceCoverages () : float[] {
		return insuranceControl.Coverages;
	}
	
	public function GetInsuranceCoverage () : float {
		return insuranceControl.Coverage;
	}
	
	public function GetInsurancePlan () : int {
		return insuranceControl.Plan;
	}
	
	public function ToggleInsurance () {
		GameState.ToggleState (State.Insurance);
	}
	
	public function PurchaseInsurance (plan : int) {
		if (GetInsurancePlan () >= plan) return;
		var cost : int = insuranceControl.GetPremium (plan);
		if (wealthControl.SubtractWealth (cost)) {
			insuranceControl.Purchase (plan);
			growerControl.SetInsuranceCoverage (GetInsuranceCoverage ());
			Messenger.instance.Send ("purchase insurance");
			AudioPlay ("acceptlow");
			if (tutorialLevel) {
				tutorialControl2.CanCloseInsurance = true;
			} else {
				dataController.AddInsuranceData(plan);
			}
		}
	}
	
	public function OpenInsurance () {
		GameState.SetState (State.Insurance);
		if (tutorialLevel) tutorialControl2.OpenInsurance ();
		PauseTime ();
	}
	
	public function CloseInsurance () {
		if (tutorialLevel) {
			if (!tutorialControl2.CanCloseInsurance) return;
		}
		GameState.SetStateDefault ();
		ResumeTime ();
	}
	
	// --------------------- Knowledge --------------------- //
	
	public function ToggleKnowledge () {
		GameState.ToggleState (State.Knowledge);
	}
	
	public function OpenKnowledge () : boolean {
		return GameState.SetState (State.Knowledge);
	}
	
	public function CloseKnowledge () {
		if (GameState.CheckState (State.Knowledge)) {
			GameState.SetStateDefault ();
		}
	}
		
	// ----------------------- Level ----------------------- //
	
	public function GetLevel () : int {
		return levelControl.Level;
	}
	
	public function GetLastLevel () : boolean {
		return levelControl.LastLevel;
	}
	
	public function ResetLevel () {
		Messenger.instance.Send ("reset level");
		levelControl.ResetLevel ();
		developmentControl.ResetLevel ();
		growerControl.ResetLevel ();
		protectionControl.ResetLevel ();
		wealthControl.ResetLevel ();
		StartLevel ();
	}
	
	public function StartLevel () {
		won = false;
		GameState.SetStateDefault ();
		var level : int = levelControl.StartLevel ();
		audioControl.StartLevel ();
		developmentControl.StartLevel (level, tutorialLevel);
		growerControl.StartLevel ();
		insuranceControl.StartLevel ();
		protectionControl.StartLevel ();
		shockControl.StartLevel (level, tutorialLevel);
		timeControl.StartLevel ();
		wealthControl.StartLevel ();
		Messenger.instance.Send ("start level");
	}
	
	public function EndLevel () {
		if (tutorialLevel) {
			tutorialControl2.EndLevel ();
			return;
		}
		GameState.SetState (State.BetweenLevels);
		developmentControl.EndLevel ();
		won = developmentControl.GetGoalReached ();
		audioControl.EndLevel (won);
		levelControl.EndLevel (won);
		wealthControl.EndLevel ();
		shockControl.EndLevel (won);
		dataController.EndLevel(GetShockReports(),GetProtection (), GetLevel(), GetDevProgress(), GetGrowerLevels());
	}
	
	public function RestartGame () {
		audioControl.Reset ();
		developmentControl.Reset ();
		levelControl.Reset ();
		protectionControl.Reset ();
		Messenger.instance.Send ("update protection");
		wealthControl.Reset ();
		growerControl.Reset ();
		plotControl.Reset ();
		StartLevel ();
	}
	
	// ------------------------ Plot ----------------------- //
	
	public function GetCenterPlotPosition () : Vector3 {
		return plotControl.GetCenterPlotPosition ();
	}
	
	// --------------------- Protection -------------------- //
	
	public function GetProtection () : float {
		return protectionControl.Protection;
	}
	
	public function GetProtectionCost () : float {
		return protectionControl.Cost;
	}
	
	public function GetTotalProtection () : float {
		var multiplier : float = earlyWarningControl.Multiplier;
		var protection : float = protectionControl.Protection;
		if (multiplier > 0.0 && protection < 0.01) {
			protection = 0.01;
		}
		return Mathf.Clamp01 (protection * multiplier);
	}
	
	public function StartProtection () {
		GameState.SetState (State.Protection);
		protectionControl.StartProtection ();
		developmentControl.StartProtection ();
		audioControl.StartProtection ();
		if (tutorialLevel) tutorialControl2.StartProtection ();
	}
	
	public function UpdateProtection (cost : float) : boolean {
		if (wealthControl.SubtractWealth (cost)) {
			Messenger.instance.Send ("update protection");
			return true;
		}
		return false;
	}
	
	public function StopProtection (setState : boolean) {
		if (setState) GameState.SetStateDefault ();
		protectionControl.StopProtection ();
		developmentControl.StopProtection ();
		audioControl.StopProtection ();
	}
	
	public function ToggleProtection () {
		GameState.ToggleState (State.Protection);
		if (GameState.CheckPreviousState (State.Protection)) {
			//StopProtection ();
		}
	}
	
	public function OpenProtection () {
		GameState.SetState (State.Protection);
	}
	
	public function CloseProtection () {
		GameState.SetStateDefault ();
	}
	
	// ----------------------- Shock ----------------------- //
	
	private function GetShockReports() : ShockReports{
		return shockControl.shockReports;
	}
	
	public function ShockCanHit () : boolean {
		if (tutorialLevel) {
			return tutorialControl2.ShockCanHit ();
		} else {
			return true;
		}
	}
	
	public function ShockHit (attributes : ShockAttributes) {
		if (tutorialLevel) attributes = tutorialControl2.FudgeAttributes (attributes);
		hitAttributes = attributes;
		audioControl.ShockHit ();
		StartEarlyWarning (hitAttributes.EarlyWarningProgress, hitAttributes.Severity);
	}
	
	public function ShockMissed (attributes : ShockAttributes) {
		Messenger.instance.Send ("shock missed");
		shockControl.ShockMissed (GetLevel (), attributes, GetProtection (), GetInsurancePlan ());
		if (tutorialLevel) tutorialControl2.ShockMissed ();
	}
	
	public function CalculateSeverity () : float {
		return Mathf.Max (0.0, hitAttributes.Severity - GetTotalProtection ()); 
	}
	
	public function IsDamaged () : boolean {
		return Mathf.Round (CalculateSeverity () * 10.0) / 10.0 >= 0.01;
	}
	
	public function ShockDamage () {
		
		var severity : float = CalculateSeverity ();
		var lostDev : float = developmentControl.ShockDamage (severity);
		var damaged : boolean = IsDamaged ();
		
		if (damaged) {
			audioControl.ShockDamage ();
		}
		
		var totalCost : int = growerControl.ShockDamage (severity, lostDev);
		protectionControl.ShockDamage (hitAttributes.Severity);
		shockControl.ShockDamage (
			GetLevel (), 
			hitAttributes, 
			protectionControl.Protection, 
			GetInsurancePlan (), 
			earlyWarningControl.Multiplier, 
			severity, 
			totalCost
		);
		earlyWarningControl.ResetMultiplier ();
		
		Messenger.instance.Send ("update protection");
		if (damaged) {
			Invoke ("OpenDamagedTutorial", Time.deltaTime);
		}
	}
	
	function OpenDamagedTutorial () {
		OpenTutorial ("Damaged");
	}
	
	/*private function GetShock (index : int) : Shock {
		return shockControl.GetShock (index);
	}*/
	
	public function StartViewingShock (shock : Shock) : boolean {
		if (tutorialLevel) {
			if (!tutorialControl2.CanViewShock ()) return false;
		}
		// Don't continue if the shock doesn't exist or we're already viewing it
		if (shock == null) return false;
		var cost : float = (paused) ? 0.0 : shockControl.Cost;
		if (wealthControl.SubtractWealth (cost)) {
			shock.StartViewing ();
			audioControl.StartViewingShock ();
			GameState.SetState (State.Knowledge);
			if (tutorialLevel) tutorialControl2.ViewShock ();
			if (OpenTutorial ("Telescope")) {
				CloseTutorialInGameText ("Meteor");
			}
			return true;
		}
		return false;
	}
	
	public function OnShockDestroyed () {
		if (GameState.CheckState (State.Knowledge)) {
			audioControl.StopViewingShock ();
			GameState.SetStateDefault ();
		}
	}
	
	public function StopViewingShock (shock : Shock) {
		shock.StopViewing ();
		audioControl.StopViewingShock ();
		OpenTutorialPointers ();
		if (GameState.CheckState (State.Knowledge)) GameState.SetStateDefault ();
	}
	
	public function StopViewingAllShocks () {
		audioControl.StopViewingShock ();
		if (GameState.CheckState (State.EarlyWarning)) return;
		OpenTutorialPointers ();
		GameState.SetStateDefault ();
	}
	
	public function StopViewingAllShocks (setDefault : boolean) {
		shockControl.StopViewingShocks (null);
		audioControl.StopViewingShock ();
		OpenTutorialPointers ();
		if (setDefault) GameState.SetStateDefault ();
	}
		
	// ------------------------ Time ----------------------- //
	
	public function GetTime () : float {
		return timeControl.RemainingTime;
	}
	
	public function GetElapsedTime () : float {
		return timeControl.ElapsedTime;
	}
	
	// ---------------------- Tutorial --------------------- //
	
	public function OpenTutorial (id : String) : boolean {
		if (!tutorialEnabled) return false;
		//if (GameState.CheckState (State.Tutorial) ||
		if (tutorialControl.GetBoxShown (id)) return false;
			
		tutorialControl.SetTextbox (id);
		GameState.SetState (State.Tutorial);
		PauseTime ();
		return true;
	}
	
	public function CloseTutorial () {
		GameState.SetStatePrevious ();
		if (GameState.TimePassing ()) ResumeTime ();
		yield WaitForSeconds (0.5);
		OpenTutorialInGameText ("Grower");
	}
	
	public function TutorialStartGame () {
		OpenTutorial ("Welcome");
	}
	
	public function OpenTutorialInGameText (id : String) {
		if (!tutorialEnabled) return;
		if (tutorialControl.GetInGameTextShown (id)) return;
		tutorialControl.OpenInGameText (id);
	}
	
	public function CloseTutorialInGameText (id : String) {
		if (!tutorialEnabled) return;
		tutorialControl.CloseInGameText (id);
	}
	
	public function OpenTutorialPointers () {
		if (!tutorialEnabled) return;
		tutorialControl.OpenPointers ();
		/*tutorialControl.OpenPointer ("Insurance");
		tutorialControl.OpenPointer ("Protection");*/
	}
	
	// ----------------------- Wealth ---------------------- //
	
	public function GetWealth () : float {
		return wealthControl.Wealth;
	}
	
	function _StateChanged () {
		//Debug.Log (GameState.previousState + " -> " + GameState.state);
		/*if (GameState.CheckPreviousState (State.Knowledge) && !GameState.CheckState (State.Tutorial)) {
			StopViewingAllShocks (false);
		}*/
		/*if (GameState.CheckPreviousState (State.Protection)) {
			StopProtection ();
		}*/
	}
	
	// <debugging>
	
	public function ShowDebugMessage (s : String) {
		debugText = s;
	}
	
	public function ResetDebugMessage () {
		debugText = "";
	}
	
	function Update () {
		if (Input.GetKeyDown (KeyCode.R)) {
			//ResetLevel ();
		}
		if (!debugging) return;
		/*if (Input.GetKeyDown (KeyCode.Space)) {
			if (GameState.CheckState (State.BetweenLevels)) {
				if (won) {
					StartLevel ();
				} else {
					RestartGame ();
				}
			}
		}*/
		
		/*if (Input.GetKeyDown (KeyCode.R)) {
			wealthControl.Wealth = 0;
			Messenger.instance.Send ("wealth updated");
		}*/
		
		/*if (Input.GetKeyDown (KeyCode.J)) {
			OpenTutorial ("Interface");
		}*/
		
		/*if (Input.GetKeyDown (KeyCode.K)) {
			//ToggleKnowledge ();
		}
		if (Input.GetKeyDown (KeyCode.I)) {
			//ToggleInsurance ();
		}
		if (Input.GetKeyDown (KeyCode.G)) {
			//CreateGrower ();
		}
		
		if (Input.GetKeyDown (KeyCode.P)) {
			if (GameState.CheckState (State.EarlyWarning)) {
				//StartEarlyWarningMultiplier ();
			} else {
				//StartProtection ();
				//ToggleProtection ();
			}
		}
		if (Input.GetKeyUp (KeyCode.P)) {
			if (GameState.CheckState (State.EarlyWarning)) {
				//StopEarlyWarningMultiplier ();
			} else {
				//StopProtection ();
			}
		}
		
		for (var i = 0; i < keyCodes.Length; i ++) {
			if (Input.GetKeyDown (keyCodes[i])) {
				switch (GameState.state) {
					//case State.Development : BuildGrower (GetGrower (i)); break;
					//case State.Insurance: if (i < 3) PurchaseInsurance (i); break;
					//case State.Knowledge: ViewShock (GetShock (i)); break;
				}
			}
		}*/
	}
	// </debugging>
	
	/*function OnGUI () {
		GUI.Label (new Rect (10, 10, 100, 100), debugText);
	}*/
}