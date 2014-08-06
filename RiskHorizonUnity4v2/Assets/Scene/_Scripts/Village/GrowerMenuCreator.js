#pragma strict

class GrowerMenuCreator extends GameSprite {
	
	public var keycodes : KeyCode[] = [
		KeyCode.Alpha0,
		KeyCode.Alpha1,
		KeyCode.Alpha2,
		KeyCode.Alpha3,
		KeyCode.Alpha4,
		KeyCode.Alpha5,
		KeyCode.Alpha6,
		KeyCode.Alpha7,
		KeyCode.Alpha8
	];
	
	public var hotkey : KeyCode = KeyCode.None;
	
	private var growerMenu : GrowerMenu;
	private var cost : int;
	private var action : String;
	private var level : String;
	private var health : float;
	private var showInGameText : boolean = true;
	
	@System.NonSerialized
	public var showMenu : boolean = true;
	private var activated : boolean = true;
	
	@System.NonSerialized
	public var plotPosition : Transform;
	
	public function get Cost () { return cost; }
	public function set Cost (value : int) { cost = value; }
	public function get Action () { return action; }
	public function set Action (value : String) { action = value; }
	public function get Level () { return level; }
	public function set Level (value : String) { level = value; }
	public function get Health () : float { return health; }
	public function set Health (value : float) { health = value; }
	public function get Activated () : boolean { return activated; }
	public function set Activated (value : boolean) { activated = value; }
	
	private var tutorialLevel : boolean = false;
	
	function Start () {
		Messenger.instance.Listen ("disable actions", this);
		Messenger.instance.Listen ("enable actions", this);
		growerMenu = GameObject.Find ("GrowerMenu").GetComponent (GrowerMenu);
		tutorialLevel = GameController.instance.tutorialLevel;
		OnStart ();
	}
	
	public function OnStart () {}
	
	function OnMouseDown () {
		if (!showMenu || !activated) return;
		if (GameState.CheckState (State.Protection)) {
			GameController.instance.CloseProtection ();
		}
		if (GameState.CheckState (State.Development)) {
			CreateMenu ();
		}
	}
	
	private function CreateMenu () {
		OnCreateMenu ();
		if (showInGameText) {
			GameController.instance.CloseTutorialInGameText ("Grower");
			showInGameText = false;
		}
		GameController.instance.AudioPlayClick1 ();
		growerMenu.Create (plotPosition.position, this);
		if (tutorialLevel) Messenger.instance.Send ("grower menu");
	}
	
	public function OnCreateMenu () {}
	public function SelectYes () {}
	
	public function SelectNo () {
		GameController.instance.AudioPlayClick2 ();	
	}
	
	function Update () {
		if (hotkey == KeyCode.None) return;
		if (Input.GetKeyDown (hotkey)) {
			OnMouseDown ();
		}
	}
	
	function _DisableActions () {
		if (!TutorialController2.disabledActions[0]) return;
		Activated = false;
	}
	
	function _EnableActions () {
		Activated = true;
	}
}