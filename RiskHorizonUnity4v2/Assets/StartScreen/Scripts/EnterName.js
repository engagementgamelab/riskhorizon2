#pragma strict

class EnterName extends GUITextBox {
	
	private var content : GTBText;
	
	function Start () {
		InitGTB (0, new Vector2 (0.0, 0.0));
		CreateBackground ();
		content = CreateText ("Enter your Coursera username.", new Vector2 (0.0, 0.1), TextSize.MediumSmall, TextAnchor.LowerCenter, true, true);
	}
}