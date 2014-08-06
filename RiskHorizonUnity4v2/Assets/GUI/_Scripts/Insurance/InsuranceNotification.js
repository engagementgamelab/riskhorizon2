#pragma strict

class InsuranceNotification extends GameSprite {
	
	function Start () {
		InitGameSprite (4, -0.1);
		Hide ();
		Messenger.instance.Listen ("start level", this);
		Messenger.instance.Listen ("purchase insurance", this);
		SetScale (0.0);
	}
	
	public function SetNotificationPosition (p : Vector2) {
		transform.position = new Vector3 (p.x, p.y, transform.position.z);
	}
	
	function _StartLevel () {
		Shrink (0.5);
	}
	
	function _PurchaseInsurance () {
		SetTexture (GameController.instance.GetInsurancePlan ());
		Grow (0.5);
		Show ();
	}
	
	public function OnEndScale (s : float) {
		if (s < 1.0) Hide ();
	}
}