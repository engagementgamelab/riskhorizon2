#pragma strict

class ShockSummaryText extends ZPositionedObject {
	
	private var text : GUIText;
	
	function Awake () {
		text = GetComponent (GUIText);
		SetZPosition (1, -0.1);
	}
	
	public function SetText (t : String) {
		text.text = t;
	}
}