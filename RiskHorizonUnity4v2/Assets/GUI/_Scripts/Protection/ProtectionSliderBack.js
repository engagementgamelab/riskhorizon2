#pragma strict

class ProtectionSliderBack extends GameSprite {
	
	public var slider : ProtectionSlider;
	private var hotkey : KeyCode = KeyCode.P;
	private var activated : boolean = true;
	
	function Start () {
		InitGameSprite (6);
		Messenger.instance.Listen ("state changed", this);
		if (!activated) Hide ();
	}
	
	public function HideBack () {
		Hide ();
		activated = false;
	}
	
	public function ShowBack () {
		FadeIn (0.5);
		activated = true;
	}
	
	function OnMouseDown () {
		if (!activated) return;
		slider.OnSelect ();
	}
	
	function OnMouseUp () {
		if (!activated) return;
		slider.OnUnselect ();
	}
	
	function Update () {
		if (!activated) return;
		if (Input.GetKeyDown (hotkey)) {
			OnMouseDown ();
		}
		if (Input.GetKeyUp (hotkey)) {
			OnMouseUp ();
		}
	}
}