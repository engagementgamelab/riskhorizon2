#pragma strict

class ShockButtonMeteor extends GameSprite {
	
	public function SetHit (hit : boolean, position : Vector3) {
		InitGameSprite (1, -0.2);
		SpriteTransform.position = new Vector3 (position.x, position.y, Depth);
		SetTexture (0);
		if (!hit) return;
		while (TextureIndex == 0) {
			SetRandomTexture ();
		}
		//SpriteTransform.position.y = position.y + 10;
	}
}