#pragma strict

class GrowerHealthBar extends FillBar {
	
	function Start () {
		CreateFills (10, 34, false);
		/*if (UseSmallScreen ()) {
			SetPosition (new Vector2 (-0.185, 0.33), true, true, true);
		} else {
			SetPosition (new Vector2 (-0.15, 0.25), true, true, true);
		}*/
		//Deactivate (false);
	}
	
	public function SetHealthPosition (p : Vector2) {
		transform.localPosition = new Vector3 (p.x, p.y, transform.localPosition.z);
	}
}