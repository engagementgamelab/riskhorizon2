#pragma strict

class IntroContinue extends GameButton {
	
	private var controller : IntroController;
	
	function Start () {
		InitGameSprite (1, -0.1);
		myTransform.position = MainCamera.SetPosition (0.0, -0.8, true);
	}
	
	public function Create (_controller : IntroController) {
		controller = _controller;
	}
	
	public function OnSelect () {
		controller.OnContinue ();
	}
	
	public function Destroy () {
		FadeOut (0.25);
	}
	
	public function OnEndFade (alpha : float) {
		if (alpha < 0.1) {
			gameObject.SetActiveRecursively (false);
		}
	}
}