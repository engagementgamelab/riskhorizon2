#pragma strict

class TelescopeSpotter extends GameSprite {
	
	public var cam : Camera;
	public var meteor : GameObject;
	public var telescope : Telescope2;
	
	private var meteors : Meteor[] = new Meteor[0];
	private var meteorAnchors : Transform[] = new Transform[0];
	private var meteorSprites : Transform[] = new Transform[0];
	private var meteorIndex : int = -1;
	private var meteorCount : int = 0;
	
	private var selectedShock : Shock = null;
	private var selected : Transform = null;
	private var snapped : Transform = null;
	private var snapDistance : float;
	private var searching : boolean = false;
	
	private var alpha : float = 0.0;
	private var position : Vector3;
	private var settingPosition : boolean = false;
	
	private var allowClickOff : boolean = true;
	private var activated : boolean = true;
	
	public function get AllowClickOff () : boolean { return allowClickOff; }
	public function set AllowClickOff (value : boolean) { allowClickOff = value; }
	
	function Awake () {
		cam = GameObject.Find ("MainCamera").camera;
	}
	
	function Start () {
		InitGameSprite (10, -0.15);
		alpha = Alpha;
		Messenger.instance.Listen ("meteor create", this);
		Messenger.instance.Listen ("meteor destroy", this);
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("enable actions", this);
		Messenger.instance.Listen ("disable actions", this);
		snapDistance = MainCamera.GetHeight () / 8;
		StartSearching ();
	}
	
	private function StartSearching () {
		StartCoroutine (CoSearch ());
	}
	
	private function CoSearch () {
		
		if (searching) return;
		searching = true;
		
		while (searching) {
			
			if (selected == null) {
				var mousePosition : Vector3 = cam.ScreenToWorldPoint (Input.mousePosition);
				snapped = FindNearestMeteor (mousePosition);
				
				if (snapped == null) {
					
					// Follow the mouse
					SetPosition (mousePosition);
				} else {
					
					// Snap to the nearest meteor
					SetPosition (snapped.position);
					if (Input.GetMouseButtonDown (0) && activated) {
						Select ();
					}
				}
				
			} else {
				
				// Snap to the selected meteor
				SetPosition (selected.position);
				if (Input.GetMouseButtonDown (0) && allowClickOff && activated) {
					Unselect ();
				}
			}
			
			yield;
		}
	}
	
	private function V3ToV2Distance (v31 : Vector3, v32 : Vector3) : float {
		v31.z = v32.z;
		return Vector3.Distance (v31, v32);
	}
	
	private function Select () : boolean {
		if (GameController.instance.StartViewingShock (selectedShock)) {
			SetColor (Color.red);
			//telescope.SetDisplay (meteors[meteorIndex]);
			telescope.Activate ();
			telescope.SetDisplay (meteors[meteorIndex]);
			selected = snapped;
			return true;
		}
		return false;
	}
	
	private function Unselect () {
		if (selected == null) return;
		GameController.instance.StopViewingShock (selectedShock);
		ApplyUnselect ();
	}
	
	private function ApplyUnselect () {
		selected = null;
		snapped = null;
		SetColor (Color.white);
		//telescope.HideDisplay ();
		telescope.Deactivate ();
	}
		
	private function SetPosition (p : Vector3) {
		p.z = Depth;
		myTransform.position = p;
	}
	
	private function UpdateMeteors () {
		
		// Get the meteors we can search through
		var meteorsGO : GameObject[] = PoolManager.instance.GetObjects (meteor);
		meteorCount = meteorsGO.Length;
		meteors = new Meteor[meteorCount];
		meteorAnchors = new Transform[meteorCount];
		meteorSprites = new Transform[meteorCount];
		for (var i = 0; i < meteorCount; i ++) {
			meteors[i] = meteorsGO[i].GetComponent (Meteor);
			meteorAnchors[i] = meteors[i].AnchorTransform;
			meteorSprites[i] = meteors[i].SpriteTransform;
		}
		
		// If the selected meteor has been destroyed
		if (selected != null) {
			if (!selected.GetComponent (GameSpriteAnchor).SpriteActive ()) {
				GameController.instance.OnShockDestroyed ();
				ApplyUnselect ();
			}
		}
	}
	
	private function FindNearestMeteor (mousePosition : Vector3) : Transform {
		
		meteorIndex = -1;
		selectedShock = null;
		if (meteorCount == 0) return null;
		
		var nearestDistance : float = Mathf.Infinity;
		var nearest : Transform = null;
		
		for (var i = 0; i < meteorCount; i ++) {
			var distance : float = V3ToV2Distance (mousePosition, meteorAnchors[i].position);
			if (distance > nearestDistance || distance > snapDistance) continue;
			nearest = meteorAnchors[i];
			nearestDistance = distance;
			meteorIndex = i;
			selectedShock = meteors[i].MyShock;
		}
		return nearest;
	}
	
	function _MeteorCreate () {
		UpdateMeteors ();
	}
	
	function _MeteorDestroy () {
		UpdateMeteors ();
	}
	
	function _StateChanged () {
	
		var state : State = GameState.state;
		if (GameState.CheckPreviousState (State.Knowledge)) {
			if (state == State.EarlyWarning) {
				Unselect ();
			} 
		}
		
		if (!GameState.TimePassing () || state == State.Tutorial) {
			searching = false;
		} else {
			StartSearching ();
		}
	}
	
	function _EnableActions () {
		activated = true;
	}
	
	function _DisableActions () {
		if (!TutorialController2.disabledActions[3]) return;
		activated = false;
	}
}