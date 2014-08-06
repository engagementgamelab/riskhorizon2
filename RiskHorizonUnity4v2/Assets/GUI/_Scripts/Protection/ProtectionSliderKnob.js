#pragma strict

class ProtectionSliderKnob extends GameSprite {
	
	private var min : float;
	private var max : float;
	private var position : float = 0.0;
	private var selected : boolean = false;
	
	function Start () {
		InitGameSprite (6, -0.1);
		var scale : float = MainCamera.scale;
		max = (Height * 0.25 * scale);
		min = -max;
		ApplyPosition (0);
		//if (UseSmallScreen ()) transform.localPosition.x = MainCamera.GetTargetHeight () * -0.045 * scale;
		transform.localPosition.x = -32.0 * scale;
	}
	
	public function OnSelect () {
		selected = true;
		SetPosition (1.0);
	}
	
	public function OnUnselect () {
		selected = false;
		SetPosition (0.0);
	}
	
	private function SetPosition (to : float) {
		
		if (Mathf.Approximately (position, to)) return;
		
		var eTime : float = 0.0;
		var time : float = 0.1;
		var from : float = position;
		var isSelected : boolean = selected;
		while (eTime < time && selected == isSelected) {
			eTime += Time.deltaTime;
			ApplyPosition (Mathf.Lerp (from, to, Mathf.SmoothStep (0.0, 1.0, eTime / time)));
			yield;
		}
	}
	
	private function ApplyPosition (progress : float) {
		myTransform.localPosition.y = Mathf.Lerp (min, max, progress);
		position = progress;
	}
}