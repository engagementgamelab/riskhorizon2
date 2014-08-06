#pragma strict

class Notification extends GameSprite {
	
	public var text : GUIText;
	private var activated : boolean = false;
	
	function Awake () {
		InitGameSprite (0);
	}
	
	function Start () {
		Messenger.instance.Listen ("wealth insufficient", this);
		HideMessage ();
	}
	
	private function ShowMessage (t : String) {
		text.text = t;
		myTransform.position = MainCamera.SetPositionV3 (0.0, 0.0, Depth, true);
		Invoke ("HideMessage", 3.0);
		yield WaitForSeconds (0.5);
		activated = true;
	}
	
	private function HideMessage () {
		text.text = "";
		myTransform.position.y = MainCamera.GetHeight () * 3;
		activated = false;
	}
	
	function Update () {
		if (!activated) return;
		if (Input.GetMouseButtonDown (0)) {
			CancelInvoke ("HideMessage");
			HideMessage ();
		}
	}
	
	function _WealthInsufficient () {
		ShowMessage ("Not enough wealth!");
	}
}