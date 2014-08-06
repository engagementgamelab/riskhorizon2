#pragma strict

class BubbleNext extends GameButton {
	
	public var tbPosition : Vector2;
	public var scalePosition : Vector2;
	
	private var textBubble : TextBubble;
	
	function Awake () {
		hotkey = KeyCode.Return;
		InitGameSprite (1, -0.1);
	}
	
	public function Create (_textBubble : TextBubble) {
		textBubble = _textBubble;
	}
	
	public function OnSelect () {
		textBubble.Close ();
	}
	
	/*function Update () {
		var p : Vector3 = MainCamera.cam.WorldToViewportPoint (transform.position);
		p.x = -TextBubble.scalePosition.x - p.x;
		p.y = -TextBubble.scalePosition.y - p.y;
		scalePosition = new Vector2 (
			Map (p.x, 0.0, 1.0, -1.0, 1.0),
			Map (p.y, 0.0, 1.0, -1.0, 1.0)
		);
	}
	
	private function Map (val : float, from1 : float, to1 : float, from2 : float, to2 : float) : float {
		return (val - from1) / (to1 - from1) * (to2 - from2) + from2;
	}*/
}