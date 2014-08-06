#pragma strict

class TutorialPointerText extends GameText {
	
	private var ids : String[] = [
		"Protection",
		"Insurance",
		"Protection2"
	];
	
	private var texts : String[] = [
		"Click and hold\nto buy protection",
		"Click to insure\nagainst shocks",
		"Fill the protection bar by raising your community out of\nharm's way. This helps prevent damage from shocks."
	];
	
	private var positions : Vector2[] = [
		new Vector2 (0.3, -0.5),
		new Vector2 (-0.8, -0.5),
		new Vector2 (-0.5, -0.5)
	];
	
	private var textsShown : boolean[];
	private var textCount : int = 0;
	private var currentId : String = "";
	
	private var protectionShownFull : boolean = false;
	private var shownTime : float = 0.0;
	private var minShownTime : float = 10.0;
	
	function Awake () {
		InitGameText (0, 0.0, "", false);
		textCount = ids.Length;
		textsShown = new boolean[textCount];
		for (var i = 0; i < textsShown.Length; i ++) {
			textsShown[i] = false;
		}
	}
	
	public function Create (_id : String) {
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("update protection", this);
		Hide ();
		var index : int = GetIndex (_id);
		if (textsShown[index]) return;
		currentId = _id;
		SetText (texts[index]);
		SetPosition (index);
		textsShown[index] = true;
		FadeIn (0.5);
	}
	
	private function SetPosition (index : int) {
		var p : Vector2 = positions[index];
		transform.position = MainCamera.SetPositionScreenSpace (p.x, p.y);
	}
	
	private function GetIndex (_id : String) {
		for (var i = 0; i < textCount; i ++) {
			if (ids[i] == _id) return i;
		}
		return -1;
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.Insurance)) {
			if (currentId == "Insurance") FadeOut (0.5, true);
			if (currentId == "Protection") FadeOut (0.5, false);
			if (currentId == "Protection2") FadeOut (0.5, false);
		}
		if (GameState.CheckPreviousState (State.Insurance)) {
			if (currentId == "Protection") FadeIn (0.5);
			if (currentId == "Protection2") FadeIn (0.5);
		}
	}
	
	function _UpdateProtection () {
		if (currentId == "Insurance") return;
		if (!protectionShownFull) {
			currentId = ids[2];
			SetPosition (2);
			SetText (texts[2]);
		}
		CancelInvoke ("FadeOutProtection2");
		Invoke ("FadeOutProtection2", 5.0);
	}
	
	function FadeOutProtection2 () {
		FadeOut (0.5, true);
	}
}