#pragma strict

class PauseButton extends MenuBarButton {

	var pauseScreen : PauseScreen;
	private var tutorialLevel : boolean = false;
	
	function Start () {
		InitGameSprite (4);
		Messenger.instance.Listen ("state changed", this);
		var left : float = -0.9;
		var right : float = 0.55;
		myTransform.position = MainCamera.SetPositionV3 (left, -0.825, Depth, false);
		// Uncomment if showing tutorial
		//Activated = false; 
		tutorialLevel = GameController.instance.tutorialLevel;
		if (tutorialLevel) {
			HideButton ();
		}
	}
	
	function OnSelect () {
		GameController.instance.Pause ();
		GameController.instance.AudioPlayClick1 ();
	}
	
	function OnUnselect () {
		GameController.instance.Resume ();
		GameController.instance.AudioPlayClick2 ();
	}
	
	function _StateChanged () {
		if (tutorialLevel) return;
		if (GameState.CheckState (State.EarlyWarning) || GameState.CheckState (State.Tutorial)) {
			Activated = false;
		} else {
			Activated = true;
		}
	}
}