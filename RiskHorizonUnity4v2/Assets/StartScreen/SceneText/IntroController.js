#pragma strict

class IntroController extends MonoBehaviour {
	
	public var background : IntroTextBackground;
	public var text : SceneIntroText;
	public var continueButton : IntroContinue;
	
	function Awake () {
		continueButton.Create (this);
	}
	
	function Start () {
		GameState.SetState (State.BetweenLevels);
		GameController.instance.PauseTime ();
	}
	
	public function OnContinue () {
		text.gameObject.SetActiveRecursively (false);
		background.Destroy ();
		continueButton.Destroy ();
		GameState.SetStateDefault ();
		GameController.instance.ResumeTime ();
	}
}