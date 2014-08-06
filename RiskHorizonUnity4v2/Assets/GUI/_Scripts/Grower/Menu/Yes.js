#pragma strict

class Yes extends GameButton {

	public var growerMenu : GrowerMenu;
	
	function Start () {
		hotkey = KeyCode.Return;
		InitGameSprite (6, -0.1, true);
		//transform.localPosition = MainCamera.SetPositionV3 (0.11, -0.03, transform.localPosition.z, true, true);
	}
	
	public function SetYesPosition (p : Vector2) {
		transform.localPosition = new Vector3 (p.x, p.y, transform.localPosition.z);
	}
	
	public function OnSelect () {
		growerMenu.SelectYes ();
	}
}