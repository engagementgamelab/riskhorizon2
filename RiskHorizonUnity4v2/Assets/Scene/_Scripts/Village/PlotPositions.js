#pragma strict

class PlotPositions extends Scalable {
	
	private var plotCount : int = 9;
	private var center : Vector3 = new Vector3 (0.0, 0.0, 0.0);
	private var width : float = 0.78;
	
	private var hardPositions : Vector3[] = [
		new Vector3 (80, -48, 0.0),
		new Vector3 (77, 108, 0.0),
		new Vector3 (271, 73, 0.0),
		new Vector3 (365, -34, 0.0),
		new Vector3 (264, -170, 0.0),
		new Vector3 (83, -214, 0.0),
		new Vector3 (-114, -161, 0.0),
		new Vector3 (-201, -46, 0.0),
		new Vector3 (-97, 83, 0.0)
	];
	
	function Start () {
		
		var scale : float = MainCamera.scale;
		var defaultWidth : float = GameSprite.defaultDimensions.x * scale;
		var defaultHeight : float = GameSprite.defaultDimensions.y * scale;
		
		var offset : Vector2 = new Vector2 (0.105, 0.08);//new Vector2 (0.21 * scale, 0.16 * scale);
		/*offset.x = Mathf.Min (0.105, offset.x);
		offset.y = Mathf.Min (0.08, offset.y);
		offset.x = 0.105;
		offset.y = 0.08;*/
		var p : Vector3 = MainCamera.AnchorLowerRight (
			defaultWidth - ((defaultWidth + 0.0) * offset.x), 
			defaultHeight - ((defaultHeight + 0.0) * offset.y), 
			0.0
		);
		
		center = p;
		OnStart ();
		ScalePositions ();
		OffsetYPositions (p);
		SetPositions ();
		OnStart ();
	}
	
	private function ScalePositions () {
		if (!UseSmallScreen ()) return;
		var scale : float = MainCamera.scale;
		for (var i = 0; i < hardPositions.Length; i ++) {
			var tv : Vector3 = hardPositions[i];
			tv.x = Mathf.Round (tv.x * 0.8 * 2.0) * scale;
			tv.y = Mathf.Round (tv.y * 0.8 * 2.0) * scale;
			hardPositions[i] = tv;
		}
	}
	
	private function OffsetYPositions (offset : Vector2) {
		var scale : float = MainCamera.scale;
		for (var i = 0; i < hardPositions.Length; i ++) {
			hardPositions[i].x -= 80 * scale;
			hardPositions[i].y += 48 * scale;
			hardPositions[i].x += offset.x;
			hardPositions[i].y += offset.y;
		}
	}
	
	private function SetPositions () {
		
		// The center plot
		OnSetPosition (hardPositions[0]);
		
		for (var i = 0; i < plotCount - 1; i ++) {
			OnSetPosition (hardPositions[i + 1]);
		}
	}
	
	public function OnStart () {}
	public function OnSetPosition (p : Vector3) {}
	
	public function GetCenterPlotPosition () : Vector3 {
		return hardPositions[0];
	}
}