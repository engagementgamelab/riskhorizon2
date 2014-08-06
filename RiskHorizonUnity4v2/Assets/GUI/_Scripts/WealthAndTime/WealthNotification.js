#pragma strict

class WealthNotification extends TextNotification {
	
	private var wealth : int = 1000;
	private var notifyCache : int = 0;
	
	function Awake () {
		InitGameText (0, 0.0);
	}
	
	function Start () {
		Messenger.instance.Listen ("wealth updated", this);
		SetFont (FontContainer.instance.GetLarge ());
		SetMaterial (FontContainer.instance.GetLargeWhite ());
		if (GameController.instance.tutorialLevel) {
			Activated = false;
		} else {
			Activated = true;
		}
	}
	
	function _WealthUpdated () {
		var gameWealth : int = GameController.instance.GetWealth ();
		var cost : int = gameWealth - wealth;
		if (cost < 0) {
			notifyCache += Mathf.Abs (cost);
			TryNotification ();
		}
		wealth = gameWealth;
	}
	
	private function TryNotification () {
		if (Notifying) {
			if (notifyCache > 0) Invoke ("TryNotification", Duration);
		} else {
			ShowNotification ("$" + Mathf.Abs (notifyCache).ToString ());
			notifyCache = 0;
		}
	}
	
	public function Show () {
		Activated = true;
	}
}