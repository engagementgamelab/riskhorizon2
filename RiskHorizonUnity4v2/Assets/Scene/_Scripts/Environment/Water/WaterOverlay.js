#pragma strict

class WaterOverlay extends GameSprite {
	
	private var timeScale : float = 1.0;
	private var time : float = 0.0;
	private var startX : float;
	private var distance : float;
	
	private var wheight : int = 864;//432;
	public function get WHeight () : int { return wheight; }
	
	function Start () {
		InitGameSprite (10, -0.3);
		Messenger.instance.Listen ("time scale set", this);
		myTransform.position = MainCamera.SetPositionV3 (-0.5, /*-0.26*/0.0, Depth, false);
		SpriteTransform.position.y -= (MainCamera.GetTargetHeight () * 0.5) - (DefaultHeight * 0.25);
		startX = myTransform.position.x;
		distance = MainCamera.GetHeight () * 0.2;
	}
	
	function Update () {
		time += Time.deltaTime * timeScale;
		var angle : float = Mathf.Sin (time);
		myTransform.position.x = startX + (angle * distance);
	}
	
	function _TimeScaleSet () {
		timeScale = TimeController.timeScale;
	}
}