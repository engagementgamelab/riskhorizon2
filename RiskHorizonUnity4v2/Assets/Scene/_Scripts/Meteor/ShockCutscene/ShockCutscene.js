#pragma strict

class ShockCutscene extends MonoBehaviour {
	
	public var parts : ShockCutscenePart[];
	public var text : ShockCutsceneText;
	
	function Start () {
		for (var i = 0; i < parts.Length; i ++) {
			parts[i] = Instantiate (parts[i]);
			parts[i].Hide ();
			parts[i].gameObject.SetActiveRecursively (false);
		}
		text = Instantiate (text);
		text.gameObject.SetActiveRecursively (false);
	}
	
	public function StartCutscene () {
		var severity : float = GameController.instance.CalculateSeverity ();
		var isDamaged : boolean = GameController.instance.IsDamaged ();
		var big : boolean = (severity >= 0.5);
		
		for (var i = 0; i < parts.Length; i ++) {
			if (isDamaged) {
				parts[i].gameObject.SetActiveRecursively (true);
				
				// Back
				if (i == 0) parts[i].SetTexture (0);
				
				// Grower
				if (i == 3) {
					if (big) {
						parts[i].SetTexture (1);
					} else {
						parts[i].SetTexture (0);
					}
				}
				
				// Water
				if (i == 4) {
					parts[i].SetSeverity (big);
				}
				
				var fadeLength : float = 0.5;
				if (i == 4) {
					fadeLength = 0.75;
				}
				parts[i].FadeIn (fadeLength);
				
			} else {
				if (i > 2) break;
				parts[i].gameObject.SetActiveRecursively (true);
				if (i == 0) parts[i].SetTexture (1);
				parts[i].FadeIn (0.5);
			}
		}
		
		text.gameObject.SetActiveRecursively (true);
		text.ShowText (severity, isDamaged);
	}
	
	public function StopCutscene () {
		for (var i = 0; i < parts.Length; i ++) {
			if (parts[i].gameObject.active) {
				parts[i].FadeOut (0.5);
			}
		}
		text.FadeOut (0.5);
		//yield WaitForSeconds (0.5);
		//text.gameObject.SetActiveRecursively (false);
	}
}