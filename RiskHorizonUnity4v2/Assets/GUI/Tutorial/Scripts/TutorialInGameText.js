#pragma strict

class TutorialInGameText extends GameText {
	
	private var textId : String[] = [
		"Grower",
		"Meteor"
	];
	
	private var texts : String[] = [ 
		"Click on a plot to build a pod",
		"Click comets to learn more about the threat"
	];
	
	private var positions : Vector2[] = [
		new Vector2 (0.2, 0.1),
		new Vector2 (0.0, 0.775)
	];
	
	private var textShown : boolean[];
	private var textCount : int = 0;
	private var currentId : String = "";
	
	private var showing : boolean = false;
	
	function Awake () {
		InitGameText (0, 0.0, "", false);
		if (UseSmallScreen ()) SetFont (smallFont);
		textCount = textId.Length;
		textShown = new boolean[textCount];
		for (var i = 0; i < textCount; i ++) {
			textShown[i] = false;
		}
	}
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
	}
	
	public function Close (_id : String) {
		if (_id == currentId) {
			showing = false;
			FadeOut (0.5);
		}
	}
	
	public function SetInGameText (_id : String) {
		Hide ();
		var index : int = GetText (_id);
		SetPosition (index);
		SetText (texts [index]);
		currentId = textId [index];
		textShown [index] = true;
		showing = true;
		FadeIn (0.5);
	}
	
	private function SetPosition (index : int) {
		transform.position = MainCamera.SetPositionScreenSpace (
			positions[index].x, 
			positions[index].y
		);
	}
	
	public function GetTextShown (_id : String) : boolean {
		var index : int = GetText (_id);
		return textShown [index];
	}
	
	private function GetText (_id : String) : int {
		for (var i = 0; i < textCount; i ++) {
			if (textId[i] == _id) return i;
		}
		return -1;
	}
	
	public function OnEndFade (alpha : float) {
		if (alpha < 0.1) {
			if (!showing) gameObject.SetActiveRecursively (false);
		}
	}
	
	function _StateChanged () {
		if (showing && Alpha < 1.0) {
			FadeIn (0.25);
		} else {
			var state : State = GameState.state;
			if (state == State.Insurance || 
				state == State.Knowledge || 
				state == State.Tutorial || 
				state == State.BetweenLevels ||
				state == State.EarlyWarning) {
				if (showing) FadeOut (0.25);
			}
		}
	}
}