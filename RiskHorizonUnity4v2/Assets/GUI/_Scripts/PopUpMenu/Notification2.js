#pragma strict

class Notification2 extends GUITextBox {
	
	public var back1 : Texture;
	public var back2 : Texture;
	public var backSmall1 : Texture;
	public var backSmall2 : Texture;
	
	private var t1 : Texture;
	private var t2 : Texture;
	
	private var frame : int = 0;
	private var blinking : boolean = false;
	
	function Awake () {
		InitGTB (0, new Vector2 (0.0, 0.0));
	}
	
	function Start () {
		CreateBackground ();
		if (UseSmallScreen ()) {
			t1 = backSmall1;
			t2 = backSmall2;
		} else {
			t1 = back1;
			t2 = back2;
		}
		Deactivate ();
		Messenger.instance.Listen ("wealth insufficient", this);
	}
	
	private function StartBlinking () {
		if (blinking) return;
		blinking = true;
		StartCoroutine (CoBlink ());
	}
	
	private function CoBlink () {
		var t : float = 0.0;
		while (blinking) {
			t += Time.deltaTime;
			if (t > 0.1) {
				SwitchFrame ();
				t = 0.0;
			}
			yield;
		}
	}
	
	private function SwitchFrame () {
		if (frame == 0) {
			SetBackground (t2);
			frame = 1;
		} else if (frame == 1) {
			SetBackground (t1);
			frame = 0;
		}
	}
	
	public function OnActivate () {
		StartBlinking ();
	}
	
	public function OnDeactivate () {
		blinking = false;
	}
	
	function _WealthInsufficient () {
		if (Active) return;
		Activate (0.25);
		yield WaitForSeconds (1.5);
		Deactivate (0.25);
	}
}