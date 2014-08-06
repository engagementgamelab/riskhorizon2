#pragma strict

class Lever extends GameSprite {
	
	private var activated : boolean = true;
	
	function Start () {
		InitGameSprite (7);
		Messenger.instance.Listen ("state changed", this);
		myTransform.position = MainCamera.SetPositionV3 (MainCamera.right - 0.33, MainCamera.bottom + 0.33, Depth, false);
	}
	
	function Activate () {
		if (activated) return;
		FadeIn (0.25);
		activated = true;
	}
	
	function Deactivate () {
		if (!activated) return;
		FadeOut (0.25);
		activated = false;
	}
	
	function OnMouseDown () {
		if (GameState.CheckState (State.Tutorial)) return;
		if (!activated) return;
		GameController.instance.StartProtection ();
	}
	
	function OnMouseUp () {
		if (GameState.CheckState (State.Tutorial)) return;
		if (!activated) return;
		//GameController.instance.StopProtection ();
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.BetweenLevels)) {
			//GameController.instance.StopProtection ();
			Deactivate ();
			return;
		}
		if (GameState.CheckState (State.EarlyWarning)) {
			Deactivate ();
			//GameController.instance.StopProtection ();
		} else {
			Activate ();
		}
		/*if (GameState.CheckState (State.Protection)) {
			Activate ();
		} else {
			Deactivate ();
		}*/
	}
}