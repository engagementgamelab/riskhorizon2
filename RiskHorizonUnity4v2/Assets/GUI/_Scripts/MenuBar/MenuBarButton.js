#pragma strict

class MenuBarButton extends GameSprite {

	static var selected : MenuBarButton = null;
	private var thisSelected : boolean = false;
	private var activated : boolean = true;
	
	public var hotkey : KeyCode;
	
	function get Activated () { return activated; }
	function set Activated (value : boolean) { activated = value; }
		 
	function Start () {
		InitGameSprite (4);
		Messenger.instance.Listen ("state changed", this);
		OnStart ();
	} 
	 
	function OnMouseDown () {
		if (!activated) return;
		Toggle();
	} 
	
	function OnMouseEnter () {
		if (!activated) return;
		if (!IsThisSelected ()){
			SetTexture(2);
		}
	}
	
	function OnMouseExit () {
		//if (!activated) return;
		if (!IsThisSelected ()){
			SetTexture(0);
		}
	}
	
	private function IsNothingSelected () {
		return (selected == null);
	}
	
	private function IsThisSelected () {
		return (selected == this);
	}
	
	public function Select () {
		if (!IsNothingSelected ()) {
			selected.Unselect();
		}
		thisSelected = true;
		SetTexture (1);
		selected = this;
		OnSelect ();
	}
	
	public function Unselect () {
		Unselect (true);
	}
	
	public function Unselect (callUnselect : boolean) {
		selected = null;
		thisSelected = false;
		SetTexture (0);
		if (callUnselect) OnUnselect ();
	}
	
	public function Toggle () {
		if (!thisSelected) {
			Select();
		} else{
			Unselect();
		}
	}
	
	public function HideButton () {
		Hide ();
		activated = false;
	}
	
	public function ShowButton () {
		FadeIn (0.5);
		activated = true;
		OnShowButton ();
	}
	
	function _StateChanged () {
		OnStateChanged ();
		//activated = GameState.TimePassing ();
	}
	
	public function OnStart () {}
	public function OnSelect () {}
	public function OnUnselect () {}
	public function OnStateChanged () {}
	public function OnShowButton () {}
	
	function Update () {
		if (Input.GetKeyDown (hotkey) && activated) {
			OnMouseDown ();
		}
	}
}

