#pragma strict

class ShockButtonNumber extends GameSprite {

	public function SetID (id : int, position : Vector3) {
		InitGameSprite (1, -0.3);
		SpriteTransform.position = new Vector3 (position.x, position.y, Depth);
		SetTexture (id);
	}
}