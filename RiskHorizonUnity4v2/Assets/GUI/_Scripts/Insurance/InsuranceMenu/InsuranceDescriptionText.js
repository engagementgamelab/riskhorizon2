#pragma strict

class InsuranceDescriptionText extends GameText {
	
	function Awake () {
		InitGameText (0, -0.5, "If your pods are damaged, these insurance plans\nwill cover part of the repair costs and replace\npart of your lost development.");
		transform.position = MainCamera.SetPositionScreenSpace (-0.55, 0.45);
	}
}