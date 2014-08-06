#pragma strict

class GameSpriteAnchor extends MonoBehaviour {
	
	private var sprite : GameSprite;
	
	function get Sprite () { return sprite; }
	
	function Create (_sprite : GameSprite) : Transform {
		sprite = _sprite;
		return transform;
	}
	
	public function SpriteActive () : boolean {
		return sprite.gameObject.active;
	}
}