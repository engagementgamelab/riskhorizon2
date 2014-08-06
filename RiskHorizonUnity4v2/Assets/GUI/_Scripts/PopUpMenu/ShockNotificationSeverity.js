#pragma strict

class ShockNotificationSeverity extends FillBar {
	
	function Awake () {
		transform.position = MainCamera.SetPositionV3 (-0.67, 0.6, transform.position.z, false);
		CreateFills (10, 15.5, false);
		Hide ();
	}
}