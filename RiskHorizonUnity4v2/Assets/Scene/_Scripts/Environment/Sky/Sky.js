#pragma strict

class Sky extends TimeScalable {
	
	//private var smallScreen : boolean = true;
	
	public var skyTex : Texture;
	public var skyTexSmall : Texture;
	private var speed : float = 0.05;
	
	private var myTransform : Transform;
	
	function Awake () {
		myTransform = transform;
		//myTransform.position.y = skyTexSmall.height * -0.15;
		myTransform.position.y = 0.0;
		/*if (UseSmallScreen ()) {
			myTransform.position.y = skyTexSmall.height * 0.1;
		} else {
			myTransform.position.y = -skyTex.height * 0.49;
		}*/
	}
	
	function Start () {
		InitTimeScalable ();
	}
	
	function Update () {
		myTransform.Rotate (Vector3.forward * speed * timeScale);
	}
}