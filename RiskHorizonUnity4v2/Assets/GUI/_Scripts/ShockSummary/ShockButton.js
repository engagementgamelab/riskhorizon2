#pragma strict

class ShockButton extends GameButton {
	
	public var meteor : ShockButtonMeteor;
	public var number : ShockButtonNumber;
	
	private var summary2 : ShockSummary2;
	private var summary : ShockSummary;
	private var id : int;
	
	static var selectedShockButton : ShockButton = null;
	
	function Awake () {
		InitGameSprite (1, -0.1);
		InitGameButton (true);
		meteor = Instantiate (meteor);
		number = Instantiate (number);
	}
	
	function Create (_summary : ShockSummary2, position : Vector2) {//, _id : int, hit : boolean) {
		summary2 = _summary;
		//id = _id;
		SpriteTransform.position = new Vector3 (position.x, position.y, Depth);
		/*meteor.gameObject.SetActiveRecursively (true);
		meteor.SetHit (hit, SpriteTransform.position);
		number.gameObject.SetActiveRecursively (true);
		number.SetID (id, SpriteTransform.position);*/
	}
	
	public function Show (_id : int, hit : boolean) {
		id = _id;
		meteor.gameObject.SetActiveRecursively (true);
		meteor.SetHit (hit, SpriteTransform.position);
		number.gameObject.SetActiveRecursively (true);
		number.SetID (id, SpriteTransform.position);
	}
	
	public function Deactivate () {
		meteor.gameObject.SetActiveRecursively (false);
		number.gameObject.SetActiveRecursively (false);
		gameObject.SetActiveRecursively (false);
	}
	
	public function OnSelect () {
		if (selectedShockButton != null && selectedShockButton != this) selectedShockButton.Unhighlight ();
		selectedShockButton = this;
		summary2.SelectShock (id);
	}
}