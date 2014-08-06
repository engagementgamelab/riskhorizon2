#pragma strict

class Meteor extends GameSprite {
	
	private var creationPosition : Vector3;
	private var landingPosition : Vector3;
	private var shock : Shock;
	private var attributes : ShockAttributes;
	
	private var anchors : Vector2[] = [
		//new Vector2 (10, 6),
		//new Vector2 (5, 5),
		//new Vector2 (10, 6),
		new Vector2 (12.0, 14.0),
		new Vector2 (12.0, 14.0),
		new Vector2 (12.0, 10.0),
		new Vector2 (12.0, 14.0)
	];
	
	public function get MyShock () : Shock { return shock; }
	public function get Attributes () : ShockAttributes { return attributes; }
	
	function Create (_creationPosition : Vector3, _landingPosition : Vector3, _shock : Shock) {
		
		InitGameSprite (10, -0.1);
		creationPosition = _creationPosition;
		landingPosition = _landingPosition;
		creationPosition.z = Depth;
		landingPosition.z = Depth;
		
		shock = _shock;
		attributes = shock.Attributes;
		SetRandomTexture ();
		SetAnchor (anchors [TextureIndex]);
		SetZPosition (10, -0.1);
		Messenger.instance.Send ("meteor create");
	}
	
	public function SetProgress (progress : float) {
		AnchorTransform.position.x = Mathf.Lerp (creationPosition.x, landingPosition.x, progress);
		AnchorTransform.position.y = Mathf.Lerp (creationPosition.y, landingPosition.y, progress * progress * progress);
		var xDelta : float = Mathf.Abs (AnchorTransform.position.x - landingPosition.x);
		var yDelta : float = Mathf.Abs (AnchorTransform.position.y - landingPosition.y);
		var r : float = xDelta / yDelta;
		if (r > 0 && yDelta != 0.0) AnchorTransform.localEulerAngles.z = Map (r, 1.5, 4.6, 10.0, -32.5);
		if (progress >= 0.99) Destroy ();
	}
	
	private function Map (val : float, from1 : float, to1 : float, from2 : float, to2 : float) {
		var lspan : float = (to1 - from1);
		var rspan : float = (to2 - from2);
		var scaled : float = (val - from1) / lspan;
		return from2 + (scaled * rspan);
	}
	
	public function Destroy () {
		PoolManager.instance.Destroy (gameObject);
		Messenger.instance.Send ("meteor destroy");
	}
	
	function Update () {
		SetProgress (shock.Progress);
	}
}