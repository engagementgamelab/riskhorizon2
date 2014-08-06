#pragma strict

class Clock extends GameText {

	private var showText : boolean = true;
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("play cutscene", this);
		Messenger.instance.Listen ("stop cutscene", this);
		transform.position = MainCamera.SetPositionScreenSpaceV3 (-0.725, -0.825);
		SetFont (FontContainer.instance.GetLarge ());
		SetMaterial (FontContainer.instance.GetLargeWhite ());
		if (GameController.instance.tutorialLevel) {
			Hide ();
		}
	}
	
	function Update () {
		if (!showText) return;
		var guiTime = GameController.instance.GetTime ();
		var minutes : int = guiTime / 60;
		var seconds : int = guiTime % 60;
		var t : String = minutes + ":" + ((seconds < 10 ? "0" : "") + seconds); 
		SetText (t);
	}
	
	function _PlayCutscene () {
		FadeOut (0.5);
	}
	
	function _StopCutscene () {
		FadeIn (0.5);
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.BetweenLevels)) {
			FadeOut (0.5);
		}
		if (GameState.CheckPreviousState (State.BetweenLevels)) {
			FadeIn (0.5);
		}
	}
}