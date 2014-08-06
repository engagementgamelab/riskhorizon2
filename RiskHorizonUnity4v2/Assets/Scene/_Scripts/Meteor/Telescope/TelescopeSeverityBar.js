#pragma strict

class TelescopeSeverityBar extends FillBar {
	
	function Start () {
		transform.position = MainCamera.SetPositionV3 (0.1375, 0.125, transform.position.z, true);
		CreateFills (10, 15.5, false);
		Deactivate ();
	}
}