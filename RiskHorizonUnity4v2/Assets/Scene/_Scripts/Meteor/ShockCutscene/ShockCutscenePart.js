#pragma strict

class ShockCutscenePart extends GameSprite {

	public function SetSeverity (big : boolean) {
		while (!CreatedSprite) { yield; }
		//if (big) SpriteTransform.position.y = Height * -0.15 * MainCamera.scale;
		//else     SpriteTransform.position.y = Height * -0.2 * MainCamera.scale;
		
		if (big) SpriteTransform.position.y = Height * -0.075 * MainCamera.scale;
		else     SpriteTransform.position.y = Height * -0.125 * MainCamera.scale;
	}
	
	public function OnEndFade (a : float) {
		if (a < 1.0) {
			gameObject.SetActiveRecursively (false);
		}
	}
}