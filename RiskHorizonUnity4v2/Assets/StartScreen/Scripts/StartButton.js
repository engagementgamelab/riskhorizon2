#pragma strict

class StartButton extends GameButton {
	
	public var ssController : StartScreenController;
	
	function Start () {
		InitGameSprite (5, 0.0);
		transform.position = MainCamera.SetPositionV3 (0.33, -0.75, transform.position.z, true);
	}
	
	public function OnSelect () {
		ssController.LoadLevel (2);
	}
}