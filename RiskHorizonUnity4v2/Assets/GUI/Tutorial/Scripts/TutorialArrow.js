#pragma strict

class TutorialArrow extends GameSprite {
	
	private var xStart : float = 0.0;
	private var animating : boolean = false;
	
	function Create (layer : int) {
		InitGameSprite (layer, -0.2);
	}
	
	public function SetPosition (position : Vector2) {
		SpriteTransform.position = MainCamera.SetPositionV3 (position.x, position.y, Depth, false);
		xStart = SpriteTransform.position.x;
	}
	
	public function StartAnimating () {
		StartCoroutine (CoAnimate ());
	}
	
	public function StopAnimating () {
		animating = false;
	}
	
	private function CoAnimate () {
		
		if (animating) return;
		animating = true;
		
		var time : float = 0.0;
		var angle : float = 0.0;
		var distance : float = 10.0;
		var speed : float = 5.0;
		
		while (animating) {
			time += Time.deltaTime * speed;
			angle = Mathf.Sin (time);
			SpriteTransform.position.x = xStart + (angle * distance);
			yield;
		}
	}
}