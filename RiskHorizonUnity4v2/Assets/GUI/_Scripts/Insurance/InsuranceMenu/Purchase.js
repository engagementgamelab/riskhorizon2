#pragma strict

class Purchase extends GameSprite {

	function Start(){
		InitGameSprite (3, -0.1);
		transform.localPosition = MainCamera.SetPositionV3 (0.5, -0.7, Depth, true);
		transform.position.z = Depth;
	}

	function OnMouseDown () {
		var p : int = InsuranceMenuButton.selectedIndex;
		if (p == -1) {
			// Cancel
			GameController.instance.CloseInsurance ();
		} else {
			// Purchase
			GameController.instance.PurchaseInsurance (p);
			GameController.instance.CloseInsurance ();
		}
	}
}


