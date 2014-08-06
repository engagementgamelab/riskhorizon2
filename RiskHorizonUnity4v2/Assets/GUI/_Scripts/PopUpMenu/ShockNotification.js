#pragma strict

class ShockNotification extends GameSprite {
	
	public var text : GUIText;
	public var severityBar : ShockNotificationSeverity;
	
	function Awake () {
		InitGameSprite (4);
	}
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("shock missed", this);
		Messenger.instance.Listen ("play cutscene", this);
		HideMessage ();
	}
	
	private function ShowMessage (t : String, severity : float) {
		myTransform.position = MainCamera.SetPositionV3 (-0.67, 0.6, Depth, false);
		//text.transform.position = MainCamera.SetPositionScreenSpace (-0.67, 0.6);
		//text.text = t;
		severityBar.gameObject.SetActiveRecursively (true);
		severityBar.Show (severity, false);
	}
	
	private function HideMessage () {
		text.text = "";
		myTransform.position.y = MainCamera.GetHeight () * 3;
		severityBar.gameObject.SetActiveRecursively (false);
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.EarlyWarning)) {
			var att : ShockAttributes = GameController.instance.HitAttributes;
			var severity : int = att.RoundedSeverity;
			CancelInvoke ("HideMessage");
			ShowMessage ("HIT!\nLevel: " + severity.ToString (), att.Severity);
		}
	}
	
	function _PlayCutscene () {
		HideMessage ();
	}
	
	function _ShockMissed () {
		ShowMessage ("Missed!", 0.0);
		Invoke ("HideMessage", 3.0);
	}
}