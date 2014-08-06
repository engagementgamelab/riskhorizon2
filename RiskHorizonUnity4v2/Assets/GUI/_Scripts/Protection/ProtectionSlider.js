#pragma strict

class ProtectionSlider extends MonoBehaviour {
	
	public var back : ProtectionSliderBack;
	public var bar : ProtectionSliderBar;
	public var fillBar : ProtectionSliderFillBar;
	public var knob : ProtectionSliderKnob;
	
	private var	myTransform : Transform;
	private var activated : boolean = true;
	private var fills : VerticalBarFill[];
	
	private var protection : float = 0.0;
	private var selected : boolean = false;
	
	private var sliderHeight : int = 320;
	private var sliderWidth : int = 240;
	private var padding : float = 0.025;
	
	function Awake () {
		myTransform = transform;
	}
	
	function Start () {
		
		var scale : float = MainCamera.scale;
		myTransform.position = MainCamera.SetPositionV3 (/*0.825*/1.0, /*-0.75*/-1.0, myTransform.position.z, false);
		myTransform.position.y += sliderHeight * 0.5 * scale;
		myTransform.position.y += sliderHeight * padding;
		myTransform.position.x -= sliderWidth * 0.5 * scale;
		myTransform.position.x -= sliderWidth * padding;
		
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("update protection", this);
		Messenger.instance.Listen ("enable actions", this);
		Messenger.instance.Listen ("disable actions", this);
		//if (GameState.CheckState (State.Tutorial)) activated = false;
		if (GameController.instance.tutorialLevel) {
			Hide ();
		}
	}
	
	public function Hide () {
		knob.Hide ();
		bar.Hide ();
		back.HideBack ();
	}
	
	public function Show () {
		knob.FadeIn (0.5);
		bar.FadeIn (0.5);
		back.ShowBack ();
	}
	
	public function OnSelect () {
		if (!activated || GameController.instance.Paused || protection >= 0.99) return;
		selected = true;
		knob.OnSelect ();
		GameController.instance.StartProtection ();
	}
	
	public function OnUnselect () {
		if (!activated || GameController.instance.Paused) return;
		OnUnselect (true);
	}
	
	public function OnUnselect (setState : boolean) {
		knob.OnUnselect ();
		GameController.instance.StopProtection (setState);
		selected = false;
	}
	
	function _StateChanged () {
		if (!GameState.TimePassing () || GameState.CheckState (State.Tutorial)) {
			OnUnselect (false);
			activated = false;
		} else {
			activated = true;
		}
	}
	
	function _UpdateProtection () {
		protection = GameController.instance.GetTotalProtection ();
		fillBar.Show (protection, false);
		if (protection >= 0.99) {
			OnUnselect (true);
		}
	}
	
	function _EnableActions () {
		//if (GameState.CheckState (State.EarlyWarning)) activated = false;
		activated = true;
	}
	
	function _DisableActions () {
		if (!TutorialController2.disabledActions[1]) return;
		if (selected) OnUnselect (true);
		activated = false;
	}
}