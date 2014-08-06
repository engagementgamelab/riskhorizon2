#pragma strict

class Sign extends GameSprite {

	function Start () {
		InitGameSprite (6, 0.0, true);
		//transform.localPosition = MainCamera.SetPositionV3 (0.0, 0.0, transform.localPosition.z, true, true);
		transform.localPosition.y = 240.0 * MainCamera.scale;
	}
}