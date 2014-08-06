#pragma strict

class ProtectingNotification extends GUITextBox {
	
	public var yellow : Material;
	public var yellowSmall : Material;
	
	private var pText : GTBText;
	private var defaultText : String = "Protecting ";
	
	function Awake () {
		InitGTB (0, new Vector2 (0.0, 0.0));
	}
	
	function Start () {
		pText = CreateText (defaultText, new Vector2 (0.0, 0.0), TextSize.Large, TextAnchor.MiddleCenter, false, false);
		/*if (UseSmallScreen ()) {
			pText.SetMaterial (yellowSmall);
		} else {
			pText.SetMaterial (yellow);
		}*/
		pText.SetMaterial (FontContainer.instance.GetLargeYellow ());
		Deactivate ();
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("update protection", this);
	}
	
	private function SetProtectionText () {
		var protection : int = Mathf.RoundToInt (GameController.instance.GetProtection () * 100.0);
		SetTextContent (0, defaultText + protection.ToString () + "%");
	}
	
	function _UpdateProtection () {
		SetProtectionText ();
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.Protection)) {
			if (!Active) Activate (0.25);
			SetProtectionText ();
		}
		if (GameState.CheckPreviousState (State.Protection)) {
			Deactivate (0.25);
		}
	}
}