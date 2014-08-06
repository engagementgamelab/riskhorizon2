#pragma strict

class TutorialTextbox2 extends GUITextBox {
	
	public var arrow : TutorialArrow;
	private var textboxController : TutorialTextboxController;
	
	function Awake () {
		InitGTB (3);
	}
	
	function Start () {
		CreateBackground ();
		CreateTabs (TabType.None, TabType.ArrowRight);
		CreateText ("tutorial text", textPositions[0], TextSize.MediumSmall);
		arrow = Instantiate (arrow);
		arrow.Create (Layer);
	}
	
	public function Create (_textboxController : TutorialTextboxController) {
		textboxController = _textboxController;
	}
	
	public function OnTabButtonSelect (tabType : TabType) {
		textboxController.Select (tabType);
	}
	
	private function SetArrow (direction : int, position : Vector2) {
		arrow.SetTexture (direction);
		arrow.SetPosition (position);
		arrow.StartAnimating ();
	}
	
	public function SetText (t : String, id : String) {
		SetTextContent (0, t);
		if (id == "Development") {
			arrow.gameObject.SetActiveRecursively (true);
			SetArrow (3, new Vector2 (-0.75, 0.42));
		} else {
			arrow.StopAnimating ();
			arrow.gameObject.SetActiveRecursively (false);
		}
	}
	
	public function OnDeactivate () {
		arrow.StopAnimating ();
		arrow.gameObject.SetActiveRecursively (false);
	}
}