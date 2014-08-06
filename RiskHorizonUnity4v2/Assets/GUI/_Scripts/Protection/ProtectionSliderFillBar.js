#pragma strict

class ProtectionSliderFillBar extends FillBar {
	
	function Start () {
		var scale : float = MainCamera.scale;
		transform.localPosition = new Vector3 (90.0 * scale, -144.0 * scale, 0.0);
		/*if (UseSmallScreen ()) {
			transform.localPosition = new Vector3 (45.0 * scale, -58.0 * scale, 0.0);
		} else {
			transform.localPosition = new Vector3 (46.0 * scale, -73.0 * scale, 0.0);
		}*/
		CreateFills (10, 40, true);
		Deactivate (false);
	}
}