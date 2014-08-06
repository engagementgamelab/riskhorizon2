#pragma strict

class GameButton extends GameSprite {
	
	private var mouseOver : boolean = false;
	private var selected : boolean = false;
	private var holdSelection : boolean = false;
	
	public var hotkey : KeyCode = KeyCode.None;
	
	private var activated : boolean = true;
	public function get Activated () : boolean { return activated; }
	public function set Activated (value : boolean) { activated = value; }
	
	function InitGameButton (_holdSelection : boolean) {
		holdSelection = _holdSelection;
	}
	
	function OnMouseEnter () {
		if (!activated) return;
		SetTexture (2);
		mouseOver = true;
	}
	
	function OnMouseExit () {
		if (!activated) return;
		if (holdSelection) {
			if (selected) SetTexture (2);
			else SetTexture (0);
		} else {
			SetTexture (0);
		}
		mouseOver = false;
	}
	
	function OnMouseDown () {
		if (!activated) return;
		SetTexture (1);
	}
	
	function OnMouseUp () {
		if (!activated) return;
		if (mouseOver) {
			OnSelect ();
			selected = !selected;
		}
		if (holdSelection) {
			SetTexture (2);
		} else {
			if (!gameObject.activeSelf) return;
			SetTexture (0);
		}
	}
	
	public function Unhighlight () {
		if (holdSelection) {
			selected = false;
			SetTexture (0);
		}
	}
	
	public function OnSelect () {}
	
	function Update () {
		if (!activated) return;
		if (hotkey == KeyCode.None) return;
		if (Input.GetKeyDown (hotkey)) {
			mouseOver = true;
			OnMouseUp ();
		}
	}
}