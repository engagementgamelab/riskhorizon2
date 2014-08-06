#pragma strict

class Connector extends GameSprite {
	
	var miniGameController : MiniGameController;
	var isActive : boolean;
	
	private var colors : Color[] = new Color[3];
	private var activated : boolean = true;

	function OnEnable () {
		isActive = true;
	}
	
	function Awake () {
		/*colors[0] = new Color (0.682, 1.0, 0.388);		// Green
		colors[1] = new Color (0.925, 0.658, 1.0);		// Pink
		colors[2] = new Color (0.537, 0.909, 0.952);	// Blue
		SetColor (colors[2]);*/
	}
	
	function Start() {
		InitGameSprite (6, 0.0);
		Messenger.instance.Listen ("enable mactions", this);
		Messenger.instance.Listen ("disable mactions", this);
		miniGameController = GameObject.Find("MiniGameController").GetComponent(MiniGameController);
	}
	
	public function Create () {
		ResetConnector ();
		Grow (0.5);
		FadeIn (0.5);
	}
	
	public function Destroy () {
		//Shrink (0.5);
		gameObject.SetActiveRecursively (false);
	}
	
	function SetSelectable () {
		//SetColor (colors[1]);
		SetTexture (1);
	}
	
	function ResetConnector () {
		//SetColor (colors[2]);
		SetTexture (0);
	}
	
	function Connected () {
		isActive = false;
		//SetColor (colors[0]);
		SetTexture (2);
	}

	function OnMouseDown () {
		if (!GameState.CheckState (State.EarlyWarning) || !activated) return;
		var v2 : Vector2 = new Vector2 (transform.position.x, transform.position.y);
		if (miniGameController.ConnectorSelected(v2, this)){
			Connected();
		}
	}
	
	function OnMouseOver () {
		if (!GameState.CheckState (State.EarlyWarning) || !activated) return;
		if (Input.GetMouseButton (0)) {
			var v2 : Vector2 = new Vector2 (transform.position.x, transform.position.y);
			if (miniGameController.ConnectorSelected (v2, this)) {
				Connected();
			}
		}
	}	
	
	/*public function OnEndScale (s : float) {
		if (s < 1.0) {
			gameObject.SetActiveRecursively (false);
		}
	}*/
	
	function _EnableMactions () {
		activated = true;
	}
	
	function _DisableMactions () {
		activated = false;
	}
}	
