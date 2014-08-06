#pragma strict

class MeteorController extends MonoBehaviour {
	
	public var meteorSprite : Texture;
	public var cam : Camera;
	public var meteor : GameObject;
	
	private var horizon : float;
	private var creationPosition : Vector3;
	private var landingPosition : Vector3;
	
	function Start () {
		cam = GameObject.Find ("MainCamera").camera;
		var scale : float = MainCamera.scale;
		var water : WaterOverlay = GameObject.Find ("WaterOverlay").GetComponent (WaterOverlay);
		var screenHeight : float = MainCamera.GetTargetHeight ();
		var top : float = ((water.WHeight * scale) + 0.0) / screenHeight;
		var buffer : float = ((meteorSprite.height * scale) + 0.0) / screenHeight;
		horizon = (1.0 - top) + buffer;
	}
	
	public function CreateMeteor (shock : Shock) : GameObject {
		var yMin : float = 1.0 - 0.075;
		var yMax : float = 1.0 - 0.025;
		var y : float = Random.Range (yMin, yMax);
		creationPosition = cam.ViewportToWorldPoint (new Vector3 (1.015, y, 0.0));
		
		var x : float = 0.15 + Random.Range (-0.05, 0.05);
		landingPosition = cam.ViewportToWorldPoint (new Vector3 (x, 1.0 - horizon, 0.0));
		
		var go : GameObject = PoolManager.instance.Instantiate (meteor, creationPosition, Quaternion.identity);
		go.GetComponent (Meteor).Create (creationPosition, landingPosition, shock);
		
		return go;
	}
}
