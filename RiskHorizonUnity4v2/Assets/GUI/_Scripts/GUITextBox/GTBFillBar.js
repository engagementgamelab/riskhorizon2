#pragma strict

class GTBFillBar extends FillBar {

	public function Create (layer : int, position : Vector2, spacing : float) {
		Create (layer, position, spacing, true, true);
	}
	
	public function Create (layer : int, position : Vector2, spacing : float, useDefaultRatio : boolean, useDefaultHeight : boolean) {
		if (useDefaultHeight) {
			transform.localPosition = MainCamera.SetPositionV3 (position.x, position.y, transform.position.z, useDefaultRatio, true);
			//transform.position = MainCamera.SetPositionV3 (position.x, position.y, transform.position.z, useDefaultRatio, true);
		} else {
			transform.localPosition = MainCamera.SetPositionV3 (position.x, position.y, transform.position.z, useDefaultRatio);
			//transform.position = MainCamera.SetPositionV3 (position.x, position.y, transform.position.z, useDefaultRatio);
		}
		CreateFills (10, spacing, false);
		SetFillsZPosition (layer);
	}
	
	function SetFillsZPosition (layer : int) {
		yield WaitForFixedUpdate ();
		SetZPosition (layer, -0.2);
	}
}