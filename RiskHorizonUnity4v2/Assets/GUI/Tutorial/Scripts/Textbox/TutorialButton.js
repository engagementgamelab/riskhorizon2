#pragma strict

class TutorialButton extends GameSprite {
	
	private var textbox : TutorialTextbox;
	private var type : String;
	
	function get Type () { return type; }
	function set Type (value : String) { type = value; }
	
	function Awake () {
		// TODO Move InitGameSprite to Start
		InitGameSprite (1, -0.1);
		OnStart ();
	}
	
	function Create (_textbox : TutorialTextbox) {
		textbox = _textbox;
	}
	
	function OnMouseUp () {
		Select ();
	}
	
	private function Select () {
		textbox.Select (Type);
	}
	
	public function OnStart () {}
}