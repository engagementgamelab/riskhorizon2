#pragma strict

class ShockCutsceneText extends GameText {

	function Awake () {
		InitGameText (0, 0.0);
		transform.position = MainCamera.SetPositionScreenSpace (0.0, -0.25);
	}
	
	function Start () {
		SetFont (FontContainer.instance.GetLarge ());
		SetMaterial (FontContainer.instance.GetLargeWhite ());
	}
	
	public function ShowText (damage : float, isDamaged : boolean) {
		Hide ();
		var d : int = Mathf.RoundToInt (damage * 100.0);
		if (!isDamaged) {
			SetText ("No damage!");
		} else {
			SetText ("Damaged " + d.ToString () + "%");
		}
		FadeIn (0.5);
	}
	
	public function OnEndFade (alpha : float) {
		if (alpha < 0.1) gameObject.SetActiveRecursively (false);
	}
}