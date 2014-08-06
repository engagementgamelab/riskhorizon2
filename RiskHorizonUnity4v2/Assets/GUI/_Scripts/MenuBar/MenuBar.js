#pragma strict

class MenuBar extends MonoBehaviour {
	
	function Start () {
		transform.position = MainCamera.SetPositionV3 (-0.875, -0.8, transform.position.z, false);
	}
}