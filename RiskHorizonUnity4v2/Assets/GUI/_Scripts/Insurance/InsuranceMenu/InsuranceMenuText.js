#pragma strict

class InsuranceMenuText extends GameText {
	
	public var colors : Material[];
	private var isCurrentPlan : boolean = false;
	
	function Awake () {
		InitGameText (0, -0.5);
	}
	
	function Start () {
		SetFont (FontContainer.instance.GetMediumSmall ());
		SetMaterial (FontContainer.instance.GetMediumSmallWhite ());
		colors[0] = FontContainer.instance.GetMediumSmallWhite ();
		colors[1] = FontContainer.instance.GetMediumSmallGrey ();
		colors[2] = FontContainer.instance.GetMediumSmallYellow ();
	}
	
	public function SetPosition (x : float, y : float) {
		transform.position = MainCamera.SetPositionScreenSpaceDefaultHeight (x, y);
	}
	
	public function SetDefault () {
		if (isCurrentPlan) return;
		SetMaterial (colors[0]);
	}
	
	public function SetUnselectable () {
		SetMaterial (colors[1]);
	}
	
	public function SetSelected () {
		SetMaterial (colors[2]);
	}
	
	public function SetCurrentPlan () {
		SetSelected ();
		isCurrentPlan = true;
	}
	
	public function ResetCurrentPlan () {
		isCurrentPlan = false;
	}
	
	public function OnCancel () {
		SetDefault ();
	}
}