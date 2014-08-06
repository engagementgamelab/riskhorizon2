#pragma strict

class GTBBackground extends GameSprite {
	
	private var gtb : GUITextBox;
	
	function Create (layer : int, tex : Texture, _gtb : GUITextBox) {
		gtb = _gtb;
		var t : Texture[] = [tex];
		InitGameSprite (layer, 0.0, false, t, null);
		SpriteTransform.localPosition = new Vector3 (0.0, 0.0, Depth);
	}
	
	public function OnEndScale (scale : float) {
		gtb.BackgroundOnEndScale (scale);
	}
}