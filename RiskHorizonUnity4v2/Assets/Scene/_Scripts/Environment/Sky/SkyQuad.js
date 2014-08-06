#pragma strict

class SkyQuad extends GameSprite {
	
	public var xSign : int = 1;
	public var ySign : int = 1;
	
	function Start () {
		InitGameSprite (10);
		var scale : float = myTransform.localScale.x * 0.5;
		myTransform.localPosition = new Vector3 (xSign * scale, ySign * scale, myTransform.position.z);
	}
}