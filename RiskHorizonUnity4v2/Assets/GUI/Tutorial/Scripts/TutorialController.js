#pragma strict

class TutorialController extends MonoBehaviour {
	
	public var textboxController : TutorialTextboxController;
	public var inGameText : TutorialInGameText;
	public var pointerText : TutorialPointerText;
	
	public var insurancePointer2 : TutorialPointerTextInsurance;
	public var protectionPointer2 : TutorialPointerTextProtection;
	
	private var protectionPointer : TutorialPointerText;
	private var insurancePointer : TutorialPointerText;
	private var shownProtection : boolean = false;
	private var shownInsurance : boolean = false;
	
	private var shownPointers : boolean = false;
	
	function Start () {
		inGameText.gameObject.SetActiveRecursively (false);
	}
	
	public function OpenInGameText (id : String) {
		inGameText.gameObject.SetActiveRecursively (true);
		inGameText.SetInGameText (id);
	}
	
	public function GetInGameTextShown (id : String) {
		return inGameText.GetTextShown (id);
	}
	
	public function CloseInGameText (id : String) {
		if (inGameText.gameObject.active) inGameText.Close (id);
	}
	
	public function SetTextbox (id : String) {
		textboxController.SetTextbox (id);
	}
	
	public function GetBoxShown (id : String) : boolean {
		return textboxController.GetBoxShown (id);
	}
	
	public function OpenPointers () {
		if (shownPointers) return;
		shownPointers = true;
		insurancePointer2.Activate (0.5);
		protectionPointer2.Activate (0.5);
	}
}