#pragma strict

class InsuranceButton extends MenuBarButton {
	
	public var notification : InsuranceNotification;
	
	private var shownInTutorial : boolean = true;
	private var iheight : float = 128.0;
	
	public function OnStart () {
		Messenger.instance.Listen ("enable actions", this);
		Messenger.instance.Listen ("disable actions", this);
		var left : float = -0.9;
		var right : float = 0.65;
		myTransform.position = MainCamera.SetPositionV3 (right, -0.825, Depth, false);
		
		var tSize : float = iheight * 0.5;
		var scale : float = MainCamera.scale;
		
		notification.SetNotificationPosition  (new Vector2 (myTransform.position.x + (tSize * scale), myTransform.position.y + (tSize * scale)));
		hotkey = KeyCode.I;
		//if (GameState.CheckState (State.Tutorial)) Activated = false;
		if (GameController.instance.tutorialLevel) {
			Activated = false;
			shownInTutorial = false;
			Hide ();
		}
	}
	
	function OnSelect () {
		GameController.instance.OpenInsurance ();
		GameController.instance.AudioPlayClick1 ();
	}
	
	function OnUnselect () {
		GameController.instance.CloseInsurance ();
		GameController.instance.AudioPlayClick2 ();
	}
	
	function OnStateChanged () {
		if (!shownInTutorial) return;
		if (GameState.CheckState (State.Tutorial) || !GameState.TimePassing () && !GameState.CheckState (State.Insurance)) {
			Activated = false;
		} else {
			Activated = true;
		}
		if (GameState.CheckPreviousState (State.Insurance) && !GameState.CheckState (State.Tutorial)) {
			Unselect (false);
		}
	}
	
	function _EnableActions () {
		if (!shownInTutorial) return;
		Activated = true;
	}
	
	function _DisableActions () {
		if (!shownInTutorial) return;
		if (!TutorialController2.disabledActions[2]) return;
		Activated = false;
	}
	
	public function OnShowButton () {
		shownInTutorial = true;
		Activated = true;
	}
}