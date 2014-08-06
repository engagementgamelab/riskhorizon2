#pragma strict

class GTBTab extends GameSprite {

	function Create (layer : int, left : boolean) {
		InitGameSprite (layer, 0.1);
		SpriteTransform.localPosition = new Vector3 (0.0, 0.0, Depth);
		if (left) {
			SetTexture (0);
		} else {
			SetTexture (1);
		}
	}
}