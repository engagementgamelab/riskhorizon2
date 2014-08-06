#pragma strict

class Bob extends GameSprite {
	
	public var glass : DevGlass;
	
	private var minY : float = -195.0;
	private var maxY : float = 256.0;
	
	function Awake () {
		myTransform = transform;
	}
	
	function Start () {
		var scale : float = MainCamera.scale;
		//minY = MainCamera.GetDefaultHeight () * -0.54167 * scale;
		//maxY = MainCamera.GetDefaultHeight () * 0.71112 * scale;
		var yStart = glass.transform.position.y;
		var glassHeight : float = glass.DefaultHeight * 0.45;
		minY = yStart -glassHeight;
		maxY = yStart + glassHeight - (glassHeight * 0.05);
		InitGameSprite (4, 0.4);
		myTransform.position = MainCamera.SetPositionV3 (-0.9, 0.1, Depth, false);
		SetProgress (0.075); // This hardcoded 0.075 is the mercury's minimum height
	}
	
	public function SetProgress (progress : float) {
		myTransform.position.y = Mathf.Lerp (minY, maxY, progress);
	}
}