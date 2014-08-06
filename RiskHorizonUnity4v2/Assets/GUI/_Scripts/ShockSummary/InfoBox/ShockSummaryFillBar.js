#pragma strict

class ShockSummaryFillBar extends FillBar {
	
	function Awake () {
		CreateFills (10, 15.5, false);
		SetZPosition (1, -0.2);
	}
}