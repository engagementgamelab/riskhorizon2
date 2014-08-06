#pragma strict

class TutorialPointerTextProtection extends GUITextBox {
	
	private var pText : GTBText;
	private var text1 : String = "Click and hold to\nincrease protection";
	private var text2 : String = "Click and hold to increase protection.";//"Fill the protection bar by raising your community out of\nharm's way. This helps prevent damage from shocks.";
	
	private var yText : float = -0.38;
	private var showing : boolean = false;
	private var closing : boolean = false;
	
	private var fadingOut : boolean = false;
	
	function Awake () {
		var position : Vector2 = new Vector2 (0.4, -0.51);
		/*if (UseSmallScreen ()) {
			position = new Vector2 (0.32, -0.41);
		}*/
		InitGTB (1, position);
	}
	
	function Start () {
		CreateBackground ();
		pText = CreateText (text1, new Vector2 (0.38, yText), TextSize.MediumSmall, TextAnchor.MiddleCenter, false, true);
		Deactivate ();
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("update protection", this);
	}
	
	public function OnActivate () {
		showing = true;
	}
	
	private function StartClosing () {
		if (closing) return;
		closing = true;
		StartCoroutine (CoClose ());
	}
	
	private function CoClose () {
		var time : float = 0.0;
		while (closing && !fadingOut) {
			if (Active) time += Time.deltaTime;
			if (time >= 1.5) {
				Close ();
				fadingOut = true;
				//closing = false;
			}
			yield;
		}
	}
	
	private function Close () {
		showing = false;
		Deactivate ();
	}
	
	public function OnDeactivate () {
		closing = false;
	}
	
	function _UpdateProtection () {
		if (!Active) return;
		/*pText.SetPosition (new Vector2 (-0.2, yText));
		SetTextContent (0, text2);*/
		StartClosing ();
	}
	
	function _StateChanged () {
		if (showing && !Active) {
			Activate ();
		} else {
			var state : State = GameState.state;
			if (state == State.Insurance || 
				state == State.Knowledge || 
				state == State.Tutorial || 
				state == State.BetweenLevels ||
				state == State.EarlyWarning) {
				if (showing) Deactivate ();
			}
		}
	}
}