#pragma strict

class TutorialTextboxController extends MonoBehaviour {
	
	public var textbox2 : TutorialTextbox2;
	
	public var textbox : TutorialTextbox;
	public var textboxText : TutorialTextboxText;
	private var text : TutorialText;
	
	private var id : String = "";
	private var box : int = 0;
	private var boxCount : int = 0;
	private var boxesShown : String[] = new String[0];
	
	function Awake () {
	}
	
	function Start () {
		textbox2 = Instantiate (textbox2);
		textbox2.Create (this);
		text = new TutorialText (textbox2.GetText (0));
		textbox2.Deactivate ();
	}
	
	public function SetTextbox (s : String) {
		id = s;
		boxesShown = AppendArray (boxesShown, id);
		SetTextboxActive (true);
		boxCount = SetText (0, s);
		SetButton ();
	}
	
	public function GetBoxShown (s : String) : boolean {
		for (var i = 0; i < boxesShown.Length; i ++) {
			if (boxesShown[i] == s) return true;
		}
		return false;
	}
	
	private function SetText (index : int, myId : String) : int {
		var t : String[] = text.GetText (id);
		textbox2.SetText (t[index], myId);
		return t.Length;
	}
	
	private function SetButton () {
		var leftTab : TabType = TabType.None;
		var rightTab : TabType = TabType.None;
		if (box > 0) {
			leftTab = TabType.ArrowLeft;
		}
		if (box < boxCount - 1) {
			rightTab = TabType.ArrowRight;
		} else {
			rightTab = TabType.Close;
		}
		textbox2.SetTabs (leftTab, rightTab);
	}
	
	public function Select (tabType : TabType) {
		if (tabType == TabType.ArrowLeft) {
			box --;
			SetText (box, text.id[box]);
			SetButton ();
		}
		if (tabType == TabType.ArrowRight) {
			box ++;
			SetText (box, text.id[box]);
			SetButton ();
		} 
		if (tabType == TabType.Close) {
			SetTextboxActive (false);
			GameController.instance.CloseTutorial ();
		}
	}
	
	private function SetTextboxActive (_active : boolean) {
		box = 0;
		if (_active) {
			textbox2.Activate ();
		} else {
			textbox2.Deactivate ();
		}
	}
	
	private function AppendArray (arr : String[], newVal : String) : String[] {
		var newLength : int = arr.Length + 1;
		var newArr : String[] = new String[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
}