#pragma strict

class GoalLine extends GameSprite {
	
	public var glass : DevGlass;
	
	private var minY : float = -195.0;
	private var maxY : float = 256.0;
	private var progress : float = 0.0;
	
	function Start () {
		InitGameSprite (4, 0.2);
		myTransform.position = MainCamera.SetPositionV3 (-0.9, 0.1, Depth, false);
		myTransform.position.y = Mathf.Lerp (minY, maxY, progress);
	}
	
	public function Create (_glass : DevGlass) {
		glass = _glass;
		InitGameSprite (4, 0.2);
		myTransform = transform;
		myTransform.position = MainCamera.SetPositionV3 (-0.9, 0.1, Depth, false);
		myTransform.position.y = Mathf.Lerp (minY, maxY, progress);
	}
	
	public function SetProgress (_progress : float) {
		/*var scale : float = MainCamera.scale;
		var height : float = MainCamera.GetDefaultHeight ();
		minY = height * -0.54167 * scale * 2.0;
		maxY = height * 0.71112 * scale * 2.0;*/
		
		var yStart = glass.transform.position.y;
		var glassHeight : float = glass.DefaultHeight * 0.45;
		minY = yStart -glassHeight;
		maxY = yStart + glassHeight - (glassHeight * 0.05);
		
		progress = _progress;
		myTransform.position.y = Mathf.Lerp (minY, maxY, progress);
	}
	
	public function SetProgress (_progress : float, animate : boolean) {
		if (animate) {
			StartCoroutine (CoSetProgress (_progress));
		} else {
			SetProgress (_progress);
		}
	}
	
	private function CoSetProgress (to : float) {
		var from : float = progress;
		var time : float = 0.5;
		var eTime : float = 0.0;
		while (eTime < time) {
			eTime += Time.deltaTime;
			SetProgress (Mathf.Lerp (from, to, Mathf.SmoothStep (0.0, 1.0, eTime / time)));
			yield;
		}
	}
	
	public function SetGoalMet () {
		var color : Color = Color.yellow;
		color.a = Alpha;
		SetColor (color);
	}
	
	public function SetGoalLost () {
		var color : Color = Color.white;
		color.a = Alpha;
		SetColor (color);
	}
}