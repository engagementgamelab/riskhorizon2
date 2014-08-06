#pragma strict

class TelescopeChanceBar extends FillBar {
	
	function Start () {
		transform.position = MainCamera.SetPositionV3 (0.1375, -0.075, transform.position.z, true);
		CreateFills (10, 15.5, false);
		Deactivate ();
	}
}