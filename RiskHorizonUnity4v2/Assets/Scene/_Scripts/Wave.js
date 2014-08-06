#pragma strict

class Wave extends GameSprite {
	
	function Start () {
		InitGameSprite (4, 0.2);
		SetColor (Color.blue);
		Hide ();
	}
	
	public function StartWave () {
		FadeIn (0.5);
	}
	
	public function StopWave () {
		FadeOut (0.5);
	}
}