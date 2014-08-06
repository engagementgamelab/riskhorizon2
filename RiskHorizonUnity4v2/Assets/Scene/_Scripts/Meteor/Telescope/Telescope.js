#pragma strict

class Telescope extends MonoBehaviour {
	
	public var spotter : TelescopeSpotter;
	public var overlay : TelescopeOverlay;
	public var back : TelescopeBack;
	public var display : TelescopeDisplay;
	
	public var severityBar : TelescopeSeverityBar;
	public var chanceBar : TelescopeChanceBar;
	public var researchBar : TelescopeResearchBar;
	
	private var horizon : float;
	private var mouseAbove : boolean = false;
	private var activated : boolean = false;
	private var fade : float = 0.25;
	private var watching : boolean = false;
	
	private var tutorialShown : boolean = false;
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		horizon = MainCamera.horizon;
		//Invoke ("ShowTutorialScreen", 0.5);
	}
	
	function ShowTutorialScreen () {
		var mpy : float = Input.mousePosition.y;
		if (mpy > horizon && GameState.CheckState (State.Development)) {
			GameController.instance.OpenTutorial ("Telescope");
		} else {
			Invoke ("ShowTutorialScreen", 0.5);
		}
	}
	
	public function SetDisplay (meteor : Meteor) {
		var attributes : ShockAttributes = meteor.Attributes;
		
		display.gameObject.SetActiveRecursively (true);
		display.SetDisplay (meteor);
		back.gameObject.SetActiveRecursively (true);
		back.ShowDisplay ();
		
		// Fill bars
		severityBar.gameObject.SetActiveRecursively (true);
		severityBar.Show (attributes.Severity, false);
		chanceBar.gameObject.SetActiveRecursively (true);
		chanceBar.Show (attributes.HitProbability, false);
		researchBar.gameObject.SetActiveRecursively (true);
		researchBar.Show (attributes.EarlyWarningProgress, false);
		
		StartCoroutine (CoWatch (attributes));
	}
	
	public function HideDisplay () {
		watching = false;
		
		display.gameObject.SetActiveRecursively (true);
		//display.HideDisplay ();
		back.gameObject.SetActiveRecursively (true);
		back.HideDisplay ();
		
		severityBar.Deactivate ();
		chanceBar.Deactivate ();
		researchBar.Deactivate ();
	}
	
	private function CoWatch (attributes : ShockAttributes) {
		if (watching) return;
		watching = true;
		while (watching) {
			
			//var estimateRange : float = attributes.EstimateRange;
			//severityBar.SetQuestionMarkRange (estimateRange);
			severityBar.Show (attributes.GetSeverityEstimate (), false);
			
			//chanceBar.SetQuestionMarkRange (estimateRange);
			chanceBar.Show (attributes.GetHitProbabilityEstimate (), false);
			
			researchBar.Show (attributes.EarlyWarningProgress, false);
			yield;
		}
	}
	
	/*private function Activate () {
		if (activated) return;
		if (GameController.instance.OpenKnowledge ()) {
			//spotter.FadeIn (fade);
			//spotter.StartSearching ();
			overlay.FadeIn (fade);
			back.FadeIn (fade);
			activated = true;
		}
	}
	
	private function Deactivate () {
		if (!activated) return;
		GameController.instance.CloseKnowledge ();
		//spotter.FadeOut (fade);
		//spotter.StopSearching ();
		overlay.FadeOut (fade);
		back.FadeOut (fade);
		activated = false;
	}*/
	
	/*function Update () {
		var mpy : float = Input.mousePosition.y;
		if (mouseAbove) {
			if (mpy < horizon) {
				Deactivate ();
				mouseAbove = false;
			}
		} else {
			if (MainCamera.mouseOverLand) return;
			if (mpy > horizon) {
				Activate ();
				mouseAbove = true;
			}
		}
	}*/
	
	function _StateChanged () {
		if (GameState.CheckPreviousState (State.Knowledge) && !GameState.CheckState (State.Tutorial)) {
			HideDisplay ();
		}
	}
}