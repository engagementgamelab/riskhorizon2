#pragma strict

class StartTutorialButton extends GameButton {
	
	public var ssController : StartScreenController;
	
	function Start () {
		InitGameSprite (5, 0.0);
		transform.position = MainCamera.SetPositionV3 (-0.4, -0.8, transform.position.z, true);
	}
	
	public function OnSelect () {
		ssController.LoadLevel (1);
	}
}