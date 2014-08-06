#pragma strict

class ZPositionedObject extends Scalable {
	
	private var myTransform : Transform;
	private var layerOffsets : float[] = [ 
		0.0,	// Notification
		100.0, 	// Pause screen, Tutorial
		200.0, 	//
		300.0,  // Insurance menu
		400.0, 	// Development bar, menu buttons, pause
		500.0, 	// Telescope
		600.0, 	// GrowerMenu
		700.0, 	// Scaffolding, Lever
		800.0, 	// Growers
		900.0, 	// Plots
		1000.0	// Sky, Meteors, WaterBackground, WaterOverlay, LandBackground, Lift, LandFrontPiece
	];
	
	public function get MyTransform () : Transform { return myTransform; }
	
	public function SetZPosition (layer : int) {
		SetZPosition (layer, 0.0);
	}
	
	public function SetZPosition (layer : int, depthOffset : float) {
		myTransform = transform;
		myTransform.position.z = depthOffset + layerOffsets[layer];
	}
}