#pragma strict

class Telescope2 extends GUITextBox {
	
	public var spotter : TelescopeSpotter;
	public var display : TelescopeDisplay;
	
	private var severity : GTBFillBar;
	private var chance : GTBFillBar;
	private var research : GTBFillBar;
	
	private var watching : boolean = false;
	private var yOrigin : float = 0.0;//0.1;
	
	function Awake () {
		InitGTB (5, new Vector2 (0.0, yOrigin));
	}
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		CreateBackground ();
		var scale : float = MainCamera.scale;
		var xPos : float = 0.36 * scale;
		severity = CreateFillBar (new Vector2 (xPos, (yOrigin + 0.625) * scale), 37);
		chance = CreateFillBar (new Vector2 (xPos, (yOrigin + 0.1325) * scale), 37);
		research = CreateFillBar (new Vector2 (xPos, (yOrigin - 0.36) * scale), 37);
		/*severity = CreateFillBar (new Vector2 (xPos, (yOrigin + 0.25) * scale), 40);
		chance = CreateFillBar (new Vector2 (xPos, (yOrigin + 0.05) * scale), 40);
		research = CreateFillBar (new Vector2 (xPos, (yOrigin - 0.142) * scale), 40);*/
		Deactivate ();
	}
	
	public function SetDisplay (meteor : Meteor) {
		var attributes : ShockAttributes = meteor.Attributes;
		display.SetDisplay (meteor);
		StartCoroutine (CoWatch (attributes));
	}
	
	private function CoWatch (attributes : ShockAttributes) {
		if (watching) return;
		watching = true;
		while (watching) {
			severity.Show (attributes.GetSeverityEstimate (), false);
			chance.Show (attributes.GetHitProbabilityEstimate (), false);
			research.Show (attributes.EarlyWarningProgress, false);
			yield;
		}
	}
	
	public function OnActivate () {
		display.gameObject.SetActiveRecursively (true);
	}
	
	public function OnFadeIn (fadeTime : float) {
		display.FadeIn (fadeTime);
	}
	
	public function OnFadeOut (fadeTime : float) {
		severity.Deactivate ();
		chance.Deactivate ();
		research.Deactivate ();
		if (display.gameObject.active) display.FadeOut (fadeTime);
	}
	
	public function OnDeactivate () {
		watching = false;
		display.gameObject.SetActiveRecursively (false);
	}
	
	function _StateChanged () {
		if (GameState.CheckPreviousState (State.Knowledge) && !GameState.CheckState (State.Tutorial)) {
			Deactivate ();
		}
	}
	
	public function GetSeverityY () : int {
		return severity.transform.position.y;
	}
	
	public function GetChanceY () : int {
		return chance.transform.position.y;
	}
	
	public function GetResearchY () : int {
		return research.transform.position.y;
	}
}