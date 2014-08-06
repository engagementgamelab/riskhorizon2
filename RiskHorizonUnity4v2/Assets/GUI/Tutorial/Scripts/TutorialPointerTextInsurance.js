#pragma strict

class TutorialPointerTextInsurance extends GUITextBox {
	
	private var pText : GTBText;
	private var showing : boolean = false;
	
	function Awake () {
		InitGTB (1, new Vector2 (-0.58, -0.485));
	}
	
	function Start () {
		CreateBackground ();
		pText = CreateText ("Click to insure\nagainst shocks", new Vector2 (-0.55, -0.375), TextSize.MediumSmall, TextAnchor.MiddleCenter, false, true);
		Deactivate ();
		Messenger.instance.Listen ("state changed", this);
	}
	
	public function OnActivate () {
		showing = true;
	}
	
	function _StateChanged () {
		
		if (!showing) return;
		
		if (GameState.CheckState (State.Insurance)) {
			showing = false;
			Deactivate ();
			return;
		}
		
		if (!Active) {
			Activate ();
		} else {
			var state : State = GameState.state;
			if (state == State.Knowledge || 
				state == State.Tutorial || 
				state == State.BetweenLevels ||
				state == State.EarlyWarning) {
				Deactivate ();
			}
		}
	}
}