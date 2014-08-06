#pragma strict

class TutorialTextbox extends MonoBehaviour {
	
	public var okButton : TutorialOK;
	public var nextButton : TutorialNext;
	private var textboxController : TutorialTextboxController;
	
	public function Create (_texController : TutorialTextboxController) {
		textboxController = _texController;
		okButton.Create (this);
		nextButton.Create (this);
	}
	
	public function SetPosition (x : float, y : float) {
		transform.position = MainCamera.SetPositionV3 (x, y, transform.position.z, true);
	}
	
	public function SetButton (next : boolean) {
		if (next) {
			nextButton.gameObject.SetActiveRecursively (true);
			okButton.gameObject.SetActiveRecursively (false);
		} else {
			nextButton.gameObject.SetActiveRecursively (false);
			okButton.gameObject.SetActiveRecursively (true);
		}
	}
	
	public function Select (type : String) {
		//textboxController.Select (type);
	}
}