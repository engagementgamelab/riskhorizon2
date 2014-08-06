#pragma strict

class ShockNotification2 extends GUITextBox {
	
	public var hitBackground : Texture;
	public var missedBackground : Texture;
	public var hitBackgroundSmall : Texture;
	public var missedBackgroundSmall : Texture;
	
	private var hitBack : Texture;
	private var missedBack : Texture;
	
	private var shockText : GTBText;
	private var severityBar : GTBFillBar;
	
	private var hitPosition : Vector2 = new Vector2 (-0.5, 0.6);
	private var missedPosition : Vector2 = new Vector2 (-0.6, 0.7);
	
	private var hit : boolean = false;
	private var severity : float;
	
	function Awake () {
		InitGTB (4, hitPosition);
	}
	
	function Start () {
		CreateBackground ();
		var scale : float = MainCamera.scale;
		//severityBar = CreateFillBar (new Vector2 (-0.315 * scale, -0.18 * scale), 32, true, true);
		severityBar = CreateFillBar (new Vector3 (-0.795 * scale, -0.44 * scale), 40, true, true);
		if (UseSmallScreen ()) {
			hitBack = hitBackgroundSmall;
			missedBack = missedBackgroundSmall;
		} else {
			hitBack = hitBackground;
			missedBack = missedBackground;
		}
		Deactivate ();
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("shock missed", this);
		Messenger.instance.Listen ("play cutscene", this);
	}
	
	private function ShowMessage (_hit : boolean, _severity : float) {
		Activate ();
		hit = _hit;
		severity = _severity;
		if (hit) {
			SetPosition (hitPosition, false);
			SetBackground (hitBack);
		} else {
			SetPosition (missedPosition, false);
			SetBackground (missedBack);
			severityBar.gameObject.SetActive (false);
		}
		GrowBackground (0.25);
	}
	
	private function HideMessage () {
		ShrinkBackground (0.25);
	}
	
	public function BackgroundOnEndScale (scale : float) {
		if (scale < 0.1) Deactivate ();
		if (scale > 0.9) {
			if (hit) {
				severityBar.Show (severity, false);
			}
		}
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.EarlyWarning)) {
			var att : ShockAttributes = GameController.instance.HitAttributes;
			CancelInvoke ("HideMessage");
			ShowMessage (true, att.Severity);
		}
	}
	
	function _PlayCutscene () {
		HideMessage ();
	}
	
	function _ShockMissed () {
		ShowMessage (false, 0.0);
		Invoke ("HideMessage", 3.0);
	}
} 