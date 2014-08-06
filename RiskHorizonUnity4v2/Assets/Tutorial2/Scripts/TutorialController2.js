#pragma strict

class TutorialController2 extends MonoBehaviour {
	
	public var tutorialText : TutorialText2;
	public var textBubble : TextBubble;
	
	public var wealth : Wealth;
	public var wealthNotification : WealthNotification;
	public var developmentBar : DevelopmentBar;
	public var clock : Clock;
	public var protection : ProtectionSlider;
	public var spotter : TelescopeSpotter;
	public var insurance : InsuranceButton;
	public var lineDrawer : LineDrawingScript;
	public var screenFade : ScreenFade;
	public var goalLine : GoalLine;
	public var bob : Bob;
	public var telescope : Telescope2;
	public var shockNotification : ShockNotification2;
	private var meteor : GameObject;
	
	private var earlyWarningController : EarlyWarningController;
	private var growerController : GrowerController;
	private var miniGameController : MiniGameController;
	private var plotController : PlotController;
	private var protectionController : ProtectionController;
	private var shockController : ShockController;
	private var timeController : TimeController;
	private var wealthController : WealthController;
	
	private var growerChallenge : boolean = false;
	private var firstCometViewed : boolean = false;
	private var secondCometViewed : boolean = false;
	private var protectionChallenge : boolean = false;
	private var inMiniGame : boolean = false;
	
	private var wait : boolean = false;
	private var nextButton : boolean = false;
	private var progress : int = 0;
	private var advanceOnClose : boolean = true;
	private var canViewShock : boolean = false;
	private var canCloseInsurance : boolean = false;
	
	private var delayID : String = "";
	private var delayAdvance : boolean = true;
	private var debugText : String = "";
	
	private var nagBuild : boolean = false;
	private var nagProtection : boolean = false;
	private var nagConnections : boolean = false;
	private var nagInsurance : boolean = false;
	
	// True = disable
	static var disabledActions : boolean[] = [
		false,	// Development
		false,	// Protection
		false,	// Insurance
		false	// Knowledge
	];
	
	public function get CanCloseInsurance () : boolean { 
		if (!canCloseInsurance) {
			ShowText ("Nag Insurance", false);
			//Invoke ("CloseText", 2.0);
			nagInsurance = true;
		}
		return canCloseInsurance; 
	}
	public function set CanCloseInsurance (value : boolean) {
		canCloseInsurance = value;
	}
	
	function Start () {
		Messenger.instance.Listen ("update protection", this);
		Messenger.instance.Listen ("grower menu", this);
	}
	
	public function Create (_earlyWarningController : EarlyWarningController,
							_growerController : GrowerController,
							_miniGameController : MiniGameController, 
							_plotController : PlotController, 
							_protectionController : ProtectionController,
							_shockController : ShockController,
							_timeController : TimeController, 
							_wealthController : WealthController) {
		
		earlyWarningController = _earlyWarningController;					
		growerController = _growerController;
		miniGameController = _miniGameController;
		plotController = _plotController;
		protectionController = _protectionController;
		shockController = _shockController;
		timeController = _timeController;
		wealthController = _wealthController;
		
		if (!GameController.instance.tutorialLevel) return;
		textBubble.Create (this);
		AdvanceTutorial ();
		//DebugStartFromProtection ();
		//DebugStartFromThirdShock ();
		//DebugStartFromFourthShock ();
		//DelayShowNag ();
		//DebugStartFromEnd ();
	}
	
	private function DebugStartFromProtection () {
		yield WaitForFixedUpdate ();
		wealthController.StartAddIncome ();
		plotController.AllowShowMenus ();
		firstCometViewed = true;
		progress = 15;
		AdvanceTutorial ();
	}
	
	private function DebugStartFromThirdShock () {
		yield WaitForFixedUpdate ();
		wealthController.StartAddIncome ();
		plotController.AllowShowMenus ();
		firstCometViewed = true;
		secondCometViewed = true;
		progress = 26;
		AdvanceTutorial ();
	}
	
	private function DebugStartFromFourthShock () {
		yield WaitForFixedUpdate ();
		wealthController.StartAddIncome ();
		plotController.AllowShowMenus ();
		firstCometViewed = true;
		secondCometViewed = true;
		progress = 31;
		AdvanceTutorial ();
	}
	
	private function DebugStartFromEnd () {
		yield WaitForFixedUpdate ();
		progress = 37;
		AdvanceTutorial ();
	}
	
	private function AdvanceTutorial () {
		//Debug.Log (progress);
		debugText = "";
		
		var cometDelay : float = 1.5;
		
		switch (progress) {
		
			// Development
			case 0 :  InvokeShowText ("Build Grower", 0.5); break;
			case 1 :  Invoke ("ShowWealth", 2.0); break;
			case 2 :  InvokeShowText ("Wealth", 1.5);
					  Invoke ("SubtractWealth", 2.5);
					  break;
			case 3 :  Invoke ("ShowDevelopmentBar", 1.0); 
					  InvokeShowText ("Development Bar", 2.0);
					  break;
			case 4 :  Invoke ("ShowClock", 1.0);
					  InvokeShowText ("Clock", 1.5);
					  break;
			case 5 :  ShowText ("Upgrading"); break;
			case 6 :  Invoke ("AdvanceTutorial", 1.5); break;
			case 7 :  ShowText ("Grower Challenge"); 
					  break;
			case 8 :  StartGrowerChallenge (); break;
			
			// First Shock
			case 9 :  firstCometViewed = false;
					  InvokeShowText ("View Comet", cometDelay);
					  CreateFirstShock (); break;
			case 10 : InvokeShowText ("Severity", 2.0); break;
			case 11 : ShowText ("Chance of Hit"); break;
			case 12 : ShowText ("Research"); 
					  spotter.AllowClickOff = true;
					  break;
			case 13 : break;
			case 14 : InvokeShowText ("Shock Missed", 0.5); break;
			
			// Protection & Second Shock
			case 15 : ShowProtection ();
					  InvokeShowText ("Protection", 0.5, false); 
					  break;
			case 16 : secondCometViewed = false;
					  Invoke ("CreateSecondShock", 3.0);
					  InvokeShowText ("View Comet", 3.0 + (cometDelay * 2));
					  break;
			case 17 : ShowText ("Match Severity"); break;
			case 18 : spotter.AllowClickOff = true;
					  GameController.instance.StopViewingAllShocks (true); 
					  ShowText ("Match Protection");
					  StartProtectionChallenge ();
					  //Invoke ("CloseText", 15.0);
					  break;
			case 19 : break;
			
			// Mini Game
			case 20 : inMiniGame = true;
					  InvokeShowText ("Mini Game Intro", 0.55); break;
			case 21 : ShowText ("Mini Game Clock"); break;
			case 22 : ShowText ("Mini Game Connections"); break;
			case 23 : var time : float = Mathf.Lerp (earlyWarningController.MinTime, earlyWarningController.MaxTime, 0.5); 
					  InvokeShowText ("Mini Game End", time);
					  Invoke ("ResetPoints", time);
					  break;
			case 24 : break;
			case 25 : InvokeShowText ("No Damage", 1.0); break;
			
			// Third shock & Insurance
			case 26 : Invoke ("CreateThirdShock", 3.0); 
					  InvokeShowText ("Impossible Shock", 3.0 + cometDelay);
					  break;
			case 27 : break;
			case 28 : InvokeShowText ("Damaged", 1.0); 
					  break;
			case 29 : break;
			case 30 : InvokeShowText ("Fixed", 0.5); break;
			case 31 : Invoke ("CreateFourthShock", 1.0);
					  Invoke ("ShowInsurance", 2.0);
					  InvokeShowText ("Insurance", 1.0 + cometDelay);
					  break;
			case 32 : break;
			case 33 : InvokeShowText ("Insurance Repair", 0.5); break;
			case 34 : break;
			case 35 : ShowText ("Recoup Development"); break;
			case 36 : ShowText ("Conclusion"); break;
			case 37 : ShowText ("Conclusion2"); break;
			case 38 : screenFade.gameObject.SetActiveRecursively (true);
					  screenFade.ScreenFadeIn (1.0, 0); 
					  wealth.FadeOut (1.0); 
					  clock.FadeOut (1.0); 
					  break;
			default : Debug.Log ("Tutorial end"); break;
		}
		progress ++;
	}
	
	public function BuildGrower () {
		if (progress == 1) AdvanceTutorial ();
	}
	
	// -------------------- Invoked Actions -------------------- //
	
	function ShowWealth () {
		wealthNotification.Show ();
		wealth.FadeIn (0.5);
		AdvanceTutorial ();
	}
	
	function SubtractWealth () {
		growerController.SetCostDefault ();
		wealthController.SubtractWealth (growerController.Cost);
	}
	
	function ShowDevelopmentBar () {
		developmentBar.Show ();
	}
	
	function ShowClock () {
		clock.FadeIn (0.5);
		timeController.ResumeCountdown ();
	}
	
	function StartGrowerChallenge () {
		wealthController.StartAddIncome ();
		plotController.AllowShowMenus ();
		growerChallenge = true;
		StartCoroutine (CoCheckDevRate ());
		nagBuild = true;
		InvokeShowText ("Nag Build", 5.0, false);
	}
	
	private function CoCheckDevRate () {
		var devRate : float = 0.0;
		while (growerChallenge) {
			devRate = developmentBar.DevSpeed;
			if (devRate >= 0.8) {
				AdvanceTutorial ();
				growerChallenge = false;
			}
			yield;
		}
	}
	
	function ShowProtection () {
		protection.Show ();
	}
	
	function StartProtectionChallenge () {
		protectionChallenge = true;
	}
	
	function ShowInsurance () {
		insurance.ShowButton ();
	}
	
	// -------------------- Shocks -------------------- //
	
	public function ShockCanHit () : boolean {
		if (progress == 9) return false;
		if (progress == 16) return false;
		if (progress == 19) {
			if (GameController.instance.GetProtection () < 0.05 ||
				shockController.LastCreatedShockAttributes.EarlyWarningProgress < 0.1) return false;
		}
		if (progress == 33) {
			if (GameController.instance.GetInsurancePlan () == -1) return false;
		}
		return true;
	}
	
	public function ShockMissed () {
		if (progress == 33) {
			progress = 31;
			AdvanceTutorial ();
			return;
		}
		if (firstCometViewed) {
			if (progress == 14) {
				AdvanceTutorial ();
			} else {
				progress = 16;
				AdvanceTutorial ();
			}
		} else {
			progress = 9;
			AdvanceTutorial ();
		}
	}
	
	public function ShockHit () {
		if (progress == 20) {
			AdvanceTutorial ();
		}
	}
	
	public function ViewShock () {
		if (progress == 10) {
			firstCometViewed = true;
			spotter.AllowClickOff = false;
			CloseText ();
			return;
		}
		
		if (progress == 27) {
			CloseText ();
			return;
		}
		
		var lCount : int = shockController.LandedCount;
		if (lCount == 0) {
			if (!firstCometViewed) {
				firstCometViewed = true;
				spotter.AllowClickOff = false;
				CloseText ();
			}
		}
		if (lCount == 1) {
			if (!secondCometViewed) {
				secondCometViewed = true;
				spotter.AllowClickOff = false;
				CloseText ();
			}
		}
	}
	
	public function FudgeAttributes (attributes : ShockAttributes) : ShockAttributes {
		var a : ShockAttributes = attributes;
		var protection : float = GameController.instance.GetProtection ();
		if (progress == 20) {
			a.Severity = protection + 0.1;
			a.EarlyWarningProgress = 0.6;
		}
		if (progress == 28) {
			if (attributes.Severity < protection) {
				a.Severity = Mathf.Min (1.0, protection + 0.3);
			}
			if (protection > 0.7) {
				protectionController.SetProtection (0.7);
			}
		}
		return a;
	}
	
	public function FudgeHit (attributes : ShockAttributes) : ShockAttributes {
		var a : ShockAttributes = attributes;
		var protection : float = GameController.instance.GetTotalProtection ();
		if (progress == 25) {
			if (attributes.Severity > protection) {
				a.Severity = protection - 0.1;
			}
		}
		if (progress == 28) {
			if (attributes.Severity < protection) {
				a.Severity = Mathf.Min (1.0, protection + 0.3);
			}
			if (Mathf.Abs (attributes.Severity - protection) > 0.5) {
				a.Severity = protection + 0.5;
			}
		}
		return a;
	}
	
	public function CanViewShock () : boolean {
		return canViewShock;
	}
	
	/*public function EndMiniGame () {
		if (progress == 24) {
			inMiniGame = false;
			AdvanceTutorial ();
		}
	}*/
	
	public function EndCutscene () {
		inMiniGame = false;
		if (progress == 33) return;
		AdvanceTutorial ();
	}
	
	private function CreateFirstShock () {
		canViewShock = false;
		meteor = shockController.CreateShockAtIndex (0);
		Invoke ("DelayCanViewShock", 3.5);
	}
	
	private function CreateSecondShock () {
		canViewShock = false;
		meteor = shockController.CreateShockAtIndex (1);
		Invoke ("DelayCanViewShock", 3.5);
	}
	
	private function CreateThirdShock () {
		canViewShock = false;
		meteor = shockController.CreateShockAtIndex (2);
		Invoke ("DelayCanViewShock", 3.5);
	}
	
	private function CreateFourthShock () {
		canViewShock = false;
		meteor = shockController.CreateShockAtIndex (3);
		Invoke ("DelayCanViewShock", 3.5);
	}
	
	function DelayCanViewShock () {
		canViewShock = true;
	}
	
	public function ReceiveBuildAction (action : Grower.BuildAction) {
		switch (action) {
			case Grower.BuildAction.Cope : BeginRepair (); break;
			case Grower.BuildAction.Upgrade : BeginUpgrade (); break;
			case Grower.BuildAction.Build : nagBuild = false; 
											if (progress == 9) CloseText (false);
											break;
		}
	}
	
	public function BeginRepair () {
		if (progress == 33) AdvanceTutorial ();
	}
	
	public function BeginUpgrade () {
		if (progress == 6) CloseText ();
	}
	
	public function FinishRepair () {
		if (progress == 30) {
			if (growerController.AllGrowersFixed ()) AdvanceTutorial ();
		}
		if (progress == 35) AdvanceTutorial ();
	}
	
	public function EndLevel () {
		timeController.RestartCountdown ();
	}
	
	public function StartProtection () {
		if (progress == 16) {
			if (!nagProtection) {
				CloseText (false);
				nagProtection = true;
				InvokeShowText ("Nag Protection", 5.0, false);
			}
		}
		if (progress== 19) CloseText ();
	}
	
	public function OpenInsurance () {
		if (progress == 32) {
			CloseText ();
		}
	}
	
	public function ResetPoints () {
		lineDrawer.ResetPoints (0);
	}
	
	// -------------------- Text -------------------- //
	
	private function InvokeShowText (ID : String, delay : float) {
		InvokeShowText (ID, delay, true);
	}
	
	private function InvokeShowText (ID : String, delay : float, advance : boolean) {
		delayID = ID;
		delayAdvance = advance;
		Invoke ("ShowTextDelayed", delay);
	}
	
	function ShowTextDelayed () {
		ShowText (delayID, delayAdvance);
	}
	
	private function ShowText (ID : String) {
		ShowText (ID, true);
	}
	
	private function ShowText (ID: String, advance : boolean) {
		
		var scale : float = MainCamera.scale;
		
		CancelInvoke ("ShowTextDelayed");
		if (ID == "Nag Build") {
			if (!nagBuild) return;
		}
		if (ID == "Nag Protection") {
			if (!nagProtection) return;
			if (GameController.instance.GetProtection () > 0.05) {
				nagProtection = false;
				return;
			}
		}
		advanceOnClose = advance;
		
		var tBox : TutorialText2.Textbox = tutorialText.GetTextbox (ID);
		wait = tBox.Wait;
		nextButton = tBox.NextButton;
		var t : String = tBox.Content;
		var width : int = textBubble.GetBubbleWidth (tBox.Background);
		var height : int = textBubble.GetBubbleHeight (tBox.Background);
		
		// Mini game specific
		if (progress == 24) {
			var m : float = earlyWarningController.Multiplier;
			m -= 1.0;
			m *= 100.0;
			m = Mathf.Round (m);
			t += m + "%";
		}
		
		var p : Vector2 = tBox.Position;
		if (ID == "Build Grower" || ID == "Upgrading" || ID == "Damaged" || ID == "Fixed") {
			var cp : Vector3 = GameController.instance.GetCenterPlotPosition ();
			p.x = MainCamera.WorldToScreenX (cp.x);
			p.y = MainCamera.WorldToScreenY (cp.y + (height * 0.55 * scale));
		}
		
		if (ID == "Development Bar") {
			p.x = MainCamera.WorldToScreenX (goalLine.transform.position.x + (goalLine.Width * 0.5 * scale) + (width * 0.33 * scale));
			p.y = MainCamera.WorldToScreenY (goalLine.transform.position.y);
		}
		
		if (ID == "Grower Challenge" || ID == "Recoup Development") {
			p.x = MainCamera.WorldToScreenX (bob.transform.position.x + (bob.Width * 0.5 * scale) + (width * 0.33 * scale));
			p.y = MainCamera.WorldToScreenY (bob.transform.position.y);
		}
		
		if (ID == "Clock") {
			p.y = MainCamera.ScreenToMyScreenY (clock.transform.position.y);
			p.y += MainCamera.WorldToScreenY (height * 0.6 * scale);
			p.x = MainCamera.ScreenToMyScreenX (clock.transform.position.x);
			p.x += MainCamera.WorldToScreenX (width * 0.3);
		}
		
		if (ID == "Wealth") {
			p.y = MainCamera.ScreenToMyScreenY (wealth.transform.position.y);
			p.y += MainCamera.WorldToScreenY (height * 0.6 * scale);
			p.x = MainCamera.ScreenToMyScreenX (wealth.transform.position.x);
			p.x += MainCamera.WorldToScreenX (width * 0.3);
		}
		
		if (ID == "Severity" || ID == "Match Severity") {
			p.y = MainCamera.WorldToScreenY (telescope.GetSeverityY ());
		}
		
		if (ID == "Chance of Hit") {
			p.y = MainCamera.WorldToScreenY (telescope.GetChanceY ());
		}
		
		if (ID == "Research") {
			p.y = MainCamera.WorldToScreenY (telescope.GetResearchY ());
		}
		
		if (ID == "Shock Missed") {
			p.x = MainCamera.WorldToScreenX (shockNotification.transform.position.x + (width * 0.6 * scale));
		}
		
		if (ID == "Protection" || ID == "Match Protection" || ID == "Mini Game Connections") {
			p.x = MainCamera.WorldToScreenX (protection.transform.position.x - (width * 0.6 * scale));
			p.y = MainCamera.WorldToScreenY (protection.transform.position.y + (width * 0.5 * scale));
		}
		
		if (ID == "Insurance") {
			p.x = MainCamera.WorldToScreenX (insurance.transform.position.x - (width * 0.45 * scale));
			p.y = MainCamera.WorldToScreenY (insurance.transform.position.y + (width * 0.6 * scale));
		}
		
		if (ID == "View Comet" || ID == "Impossible Shock") {
			p.x = MainCamera.WorldToScreenX (meteor.transform.position.x - (width * 0.25 * scale));
			p.y = MainCamera.WorldToScreenY (meteor.transform.position.y - (width * 0.3 * scale));
		}
		
		if (ID == "Mini Game Connections" || ID == "Fixed") {
			p.x *= scale;
			p.y *= scale;
		}
		
		textBubble.ShowBubble (t, p, tBox.Background, nextButton);
		
		if (wait) {
			StartWaiting ();
		}
		if (tBox.DisableActions) {
			disabledActions = tBox.DisabledActions;
			DisableActions ();
		}
	}
	
	private function StartWaiting () {
		wait = true;
		if (inMiniGame) {
			GameController.instance.PauseEarlyWarning ();
		} else {
			GameController.instance.PauseTime ();
		}
	}
	
	private function StopWaiting () {
		wait = false;
		if (inMiniGame) {
			GameController.instance.ResumeEarlyWarning ();
		} else {
			GameController.instance.ResumeTime ();
		}
	}
	
	public function CloseText () {
		CloseText (advanceOnClose);
	}
	
	public function CloseText (advance : boolean) {
		if (wait) StopWaiting ();
		nextButton = false;
		textBubble.CloseBubble ();
		EnableActions ();
		if (advance) AdvanceTutorial ();
	}
	
	private function DisableActions () {
		Messenger.instance.Send ("disable actions");
		if (GameState.CheckState (State.EarlyWarning)) Messenger.instance.Send ("disable mactions");
	}
	
	private function EnableActions () {
		if (GameState.CheckState (State.EarlyWarning)) Messenger.instance.Send ("enable mactions");
		else Messenger.instance.Send ("enable actions");
	}
	
	function Update () {
		/*if (Input.GetKeyDown (KeyCode.M)) {
			Application.LoadLevel (2);
		}
		if (nextButton) {
			if (Input.GetKeyDown (KeyCode.Space)) {
				CloseText ();
			}
		}*/
		
		if (Input.GetKeyDown (KeyCode.T)) {
			//protectionController.SetProtection (1.0);
			
			//ShowText ("Nag Build", false);
		}
		if (Input.GetMouseButtonDown (0)) {
			if (nagInsurance) {
				CloseText (false);
				nagInsurance = false;
			}
		}
	}
	
	function _UpdateProtection () {
		if (progress == 16) {
			if (GameController.instance.GetProtection () >= 0.05) {
				//CloseText (false);
				nagProtection = false;
				CancelInvoke ("ShowTextDelayed");
				AdvanceTutorial ();
			}
		}
		if (!protectionChallenge) return;
	}
	
	function _GrowerMenu () {
		if (progress == 1) CloseText (false);
		if (progress == 6) CloseText (false);
	}
}