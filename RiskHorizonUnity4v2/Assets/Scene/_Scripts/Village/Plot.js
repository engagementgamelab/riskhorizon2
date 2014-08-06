#pragma strict

class Plot extends GrowerMenuCreator {
	
	public var growerSprite : GameObject;
	private var hasGrower : boolean = false;
	private var id : int;
	
	private var resetShowMenu : boolean = false;
	
	public function get ID () : int { return id; }
	public function set ID (value : int) { id = value; }
	
	function Awake () {
		InitGameSprite (9, 0.0, true);
		DisableRenderer ();
		Cost = 200;
		Action = "Build";
		Level = "Undeveloped Plot";
		Health = -1.0;
		plotPosition = myTransform;
	}
	
	public function OnStart () {
		Messenger.instance.Listen ("reset level", this);
		Messenger.instance.Listen ("start level", this);
	}
	
	public function Create (_id : int, tutorialLevel : boolean) {
		SetID (_id);
		if (tutorialLevel && id > 0) { showMenu = false; }
	}
	
	public function AllowShowMenu () {
		showMenu = true;
	}
	
	public function DontAllowShowMenu () {
		showMenu = false;
	}
	
	private function SetID (i : int) {
		id = i;
		hotkey = keycodes[id];
	}
	
	public function SelectYes () {
		CreateGrower ();
	}
	
	function CreateGrower () {
		if (hasGrower) return;
		var g : Grower = GameController.instance.CreateGrower (id);
		if (g == null) return;
		var v30 : Vector3 = new Vector3 (0.0, 0.0, 0.0);
		var gs = PoolManager.instance.Instantiate (growerSprite, v30, Quaternion.identity);
		gs.transform.parent = myTransform.parent;
		gs.transform.localPosition = v30;
		gs.GetComponent (GrowerSprite).Create (g, myTransform, id);
		hasGrower = true;
		showMenu = false;
	}
	
	public function Reset () {
		hasGrower = false;
		showMenu = true;
	}
	
	function _ResetLevel () {
		showMenu = resetShowMenu;
		if (showMenu) hasGrower = false;
	}
	
	function _StartLevel () {
		resetShowMenu = showMenu;
	}
}