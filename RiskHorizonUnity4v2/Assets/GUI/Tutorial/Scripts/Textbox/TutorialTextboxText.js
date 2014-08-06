#pragma strict

class TutorialTextboxText extends MonoBehaviour {
	
	function Awake () {
		guiText.text = "";
	}
	
	public function SetPosition (x : float, y : float) {
		transform.position = MainCamera.SetPositionScreenSpace (x, y);
	}
	
	public function SetText (text : String) {
		guiText.text = text;
	}
}