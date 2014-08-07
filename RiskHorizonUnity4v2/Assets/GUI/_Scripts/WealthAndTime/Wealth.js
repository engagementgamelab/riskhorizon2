#pragma strict

class Wealth extends GameText {

	private var wealth : float;
	private var destWealth : float;
	private var changingWealth : boolean = false;
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("wealth updated", this);
		Messenger.instance.Listen ("play cutscene", this);
		Messenger.instance.Listen ("stop cutscene", this);
		UpdateWealth ();
		transform.position = MainCamera.SetPositionScreenSpaceV3 (-0.42, -0.825);
		SetFont (FontContainer.instance.GetLarge ());
		SetMaterial (FontContainer.instance.GetLargeWhite ());
		if (GameController.instance.tutorialLevel) {
			Hide ();
		}
	}
	
	private function UpdateWealth () {
		destWealth = Mathf.FloorToInt (GameController.instance.GetWealth ());
		StartCoroutine (CoChangeWealth ());
	}
	
	private function UpdateText () {
		var w : String = Mathf.RoundToInt (wealth).ToString ();
		SetText ("$" + w);
	}
	
	private function CoChangeWealth () {
		if (changingWealth) return;
		changingWealth = true;
		while (Mathf.Abs (wealth - destWealth) > 0) {
			wealth = Mathf.Lerp (wealth, destWealth, 0.5);
			UpdateText ();
			yield;
		}
		changingWealth = false;
	}
	
	function _WealthUpdated () {
		UpdateWealth ();
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