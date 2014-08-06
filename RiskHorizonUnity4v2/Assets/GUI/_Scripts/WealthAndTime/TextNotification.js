#pragma strict

class TextNotification extends GameText {
	
	private var xStart : float = -0.425;
	private var yStart : float = -0.8;
	private var yEnd : float = -0.55;
	private var duration : float = 0.75;
	
	private var notifying : boolean = false;
	private var activated : boolean = false;
	
	public function get Duration () : float { return duration; }
	public function get Notifying () : boolean { return notifying; }
	public function get Activated () : boolean { return activated; }
	public function set Activated (value : boolean) { activated = value; }
	
	public function InitTextNotification () {
		InitTextNotification (-0.5, -0.8, -0.55, 0.75);
	}
	
	public function InitTextNotification (_xStart : float, _yStart : float, _yEnd : float, _duration : float) {
		xStart = _xStart;
		yStart = _yStart;
		yEnd = _yEnd;
		duration = _duration;
		Debug.Log (gameObject + " " + xStart + ", " + yStart);
		MyTransform.position = MainCamera.SetPositionScreenSpaceV3 (xStart, yStart);
	}
	
	public function ShowNotification (t : String, startPosition : Vector2, _yEnd : float) {
		xStart = startPosition.x;
		yStart = startPosition.y;
		yEnd = _yEnd;
		ShowNotification (t);
	}
	
	public function ShowNotification (t : String) {
		if (!activated) return;
		notifying = true;
		SetText (t);
		StartCoroutine (CoNotify ());
	}
	
	private function CoNotify () {
		
		var time : float = duration;
		var eTime : float = 0.0;
		SetAlpha (1.0);
		
		while (eTime < time) {
		
			eTime += Time.deltaTime;
			var progress : float = eTime / time;
			var yPos : float = Mathf.Lerp (yStart, yEnd, Mathf.SmoothStep (0.0, 1.0, progress));
			MyTransform.position = MainCamera.SetPositionScreenSpaceV3 (xStart, yPos);
			
			SetAlpha (Mathf.Lerp (1.0, 0.0, Mathf.SmoothStep (1.0, 0.0, Mathf.Sqrt (Mathf.Abs (progress - 1.0)))));
			yield;
		}
		
		SetText ("");
		notifying = false;
	}
}