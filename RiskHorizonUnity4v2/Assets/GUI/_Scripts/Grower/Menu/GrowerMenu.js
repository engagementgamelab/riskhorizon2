#pragma strict

class GrowerMenu extends MonoBehaviour {

	public var sign : Sign;
	//public var text : GUIText;
	public var text : GrowerMenuText;
	public var healthBar : GrowerHealthBar;
	
	public var noButton : No;
	public var yesButton : Yes;
	
	private var resetPosition : Vector3;
	private var grower : GrowerMenuCreator;
	private var cost : int;
	private var myTransform : Transform;
	private var activated : boolean = false;
	
	function get Activated () { return activated; }
	
	function Awake () {
		myTransform = transform;
	}
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("disable actions", this);
		resetPosition = new Vector3 (0.0, MainCamera.GetHeight () * 3, myTransform.position.z);
		myTransform.position = resetPosition;
		noButton.Activated = false;
		yesButton.Activated = false;
		SetPartPositions ();
	}
		
	private function SetPartPositions () {
		yield WaitForFixedUpdate ();
		var scale : float = MainCamera.scale;
		var w : int = sign.Width * scale;
		//var h : int = sign.transform.localPosition.y - (38 * scale);
		var h : int = sign.transform.localPosition.y - (100.0 * scale);
		var wd : float = 0.175;
		noButton.SetNoPosition (new Vector2 (w * wd, h));
		yesButton.SetYesPosition (new Vector2 (w * -wd, h));
		
		//h = sign.transform.localPosition.y + (46 * scale);
		h = sign.transform.localPosition.y + (110.0 * scale);
		healthBar.SetHealthPosition (new Vector2 (w * -0.24, h));
	}
	
	public function Create (position : Vector3, _grower : GrowerMenuCreator) {
		myTransform.position.x = position.x;
		myTransform.position.y = position.y;// + (50.0 * MainCamera.scale);
		grower = _grower;
		cost = grower.Cost;
		SetText ();
		
		activated = true;
		if (grower.Health > -1.0) {
			healthBar.Show (grower.Health, false);
			SetSignTexture (1);
		} else {
			healthBar.Hide ();
			SetSignTexture (0);
		}
		
		noButton.Activated = true;
		yesButton.Activated = true;
	}
	
	private function SetText () {
		var textPosition : Vector3 = myTransform.position;
		//textPosition.y += 75.0;
		textPosition = sign.transform.position;
		textPosition.y += sign.Height * 0.1 * MainCamera.scale;
		text.transform.position = MainCamera.cam.WorldToViewportPoint (textPosition);
		//text.text = grower.Level + "\n" + grower.Action + " $" + cost.ToString ();
		text.SetText (grower.Level + "\n" + grower.Action + " $" + cost.ToString ());
	}
	
	public function SelectYes () {
		if (GameController.instance.Paused) {
			grower.SelectNo ();
		} else {
			grower.SelectYes ();
		}
		Reset ();
	}
	
	public function SelectNo () {
		grower.SelectNo ();
		Reset ();
	}
	
	function SetSignTexture (index : int){
		sign.SetTexture (index);
	}
	
	function Reset (){
		myTransform.position = resetPosition;
		//text.text = "";
		text.SetText ("");
		activated = false;
		//healthBar.Hide ();
		noButton.Activated = false;
		yesButton.Activated = false;
	}
	
	function _StateChanged () {
		if (GameState.CheckPreviousState (State.Development)) {
			Reset ();
		}
	}
	
	function _DisableActions () {
		Reset ();
	}
}