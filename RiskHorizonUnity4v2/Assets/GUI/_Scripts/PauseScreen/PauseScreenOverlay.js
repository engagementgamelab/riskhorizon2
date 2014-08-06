#pragma strict

class PauseScreenOverlay extends GUITextBox {
	
	function Awake () {
		InitGTB (2, new Vector2 (0.0, 0.0));
	}
	
	function Start () {
		CreateBackground ();
		Deactivate ();
		Messenger.instance.Listen ("game paused", this);
		Messenger.instance.Listen ("game resumed", this);
	}
	
	function _GamePaused () {
		Activate ();
	}
	
	function _GameResumed () {
		Deactivate ();
	}
}