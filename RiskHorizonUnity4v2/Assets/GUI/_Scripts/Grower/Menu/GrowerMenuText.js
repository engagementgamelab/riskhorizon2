#pragma strict

class GrowerMenuText extends GameText {
	
	function Awake () {
		InitGameText (4, 0.0);
	}
	
	function Start () {
		SetFont (FontContainer.instance.GetMediumSmall ());
		SetMaterial (FontContainer.instance.GetMediumSmallWhite ());
	}
}