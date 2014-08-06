#pragma strict

class IntroCamera extends MonoBehaviour {
	
	private var cam : Camera;
	
	function Awake () {
		cam = GetComponent (Camera);
		cam.orthographicSize = Screen.height / 2;
	}
}