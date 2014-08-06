#pragma strict

class ProtectionButton extends MenuBarButton{

	function OnSelect () {
		GameController.instance.OpenProtection ();
	}
	
	function OnUnselect () {
		GameController.instance.CloseProtection ();
	}
	
	function OnStateChanged () {
		if (GameState.CheckPreviousState (State.Protection)) {
			Unselect (false);
		}
	}
}