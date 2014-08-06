#pragma strict

class InsuranceMenuButton extends GameSprite {

	static var selected : InsuranceMenuButton = null;
	private var thisSelected : boolean = false;
	static var selectedIndex : int = -1;
	public var myIndex : int;
	private var mouseOver : boolean = false;
	private var container : InsuranceOptionContainer;	
	private var unselectable : boolean = false;
	static var currentPlanButton : InsuranceMenuButton = null;
	
	function Start () {
		InitGameSprite (3, -0.1);
	} 
	
	public function Create (_container : InsuranceOptionContainer) {
		container = _container;
	}
	
	public function SetCurrentPlan () {
		currentPlanButton = this;
		unselectable = true;
	}
	
	public function Reset () {
		currentPlanButton = null;
		unselectable = false;
		Unselect ();
	}
	
	function OnMouseEnter () {
		if (unselectable) return;
		if (selected != this) SetTexture (2);
		mouseOver = true;
	}
	
	function OnMouseExit () {
		if (unselectable) return;
		if (selected != this) {
			SetTexture (0);
		}
		mouseOver = false;
	}

	function OnMouseDown () {
		if (unselectable) return;
		Toggle();
	} 
	
	public function Select () {
		if (selected != null) {
			selected.Unselect();
		}
		SetTexture (1);
		selectedIndex = myIndex;
		selected = this;
		thisSelected = true;
		container.SetSelected ();
		OnSelect ();
	}
	
	public function Unselect () {
		selectedIndex = -1;
		selected = null;
		thisSelected = false;
		container.SetDefault ();
		if (currentPlanButton != this) {
			if (mouseOver) {
				SetTexture (2);
			} else {
				SetTexture (0);
			}
		}
		OnUnselect();
	}
	
	public function SetUnselectable () {
		unselectable = true;
	}
	
	public function Toggle () {
		if (!thisSelected) {
			Select();
			GameController.instance.AudioPlay ("clickhigh");
		} else {
			if (currentPlanButton == this) return;
			Unselect();
			if (currentPlanButton != null) currentPlanButton.Select ();
			GameController.instance.AudioPlay ("clicklow");
		}
	}
	
	public function OnCancel () {
		if (currentPlanButton == this) return;
		selectedIndex = -1;
		selected = null;
		thisSelected = false;
		SetTexture (0);
	}
	
	public function OnPurchase (index : int) {
		if (index == myIndex) return;
		selectedIndex = -1;
		selected = null;
		thisSelected = false;
		SetTexture (0);
	}
	
	public function OnSelect () {}
	public function OnUnselect () {}
}