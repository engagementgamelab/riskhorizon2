#pragma strict

class GrowerSprite extends GrowerMenuCreator {
	
	public var scaffolding : GameObject;
	public var devTimer : GameObject;
	public var wNotification : GrowerWealthNotification;
	
	private var myScaffolding : Scaffolding;
	private var myDevTimer : GrowerDevTimer;
	private var grower : Grower;
	private var development : Grower.Development;
	private var building : boolean = false;
	private var id : int;
	private var boxCollider : BoxCollider;
	
	private var usePlaceholders : boolean = true;
	
	public function Create (_grower : Grower, _plotPosition : Transform, _id : int) {
		
		grower = _grower;
		plotPosition = _plotPosition;
		id = _id;
		hotkey = keycodes[id];
		
		boxCollider = GetComponent (BoxCollider);
		
		development = grower.GetDevelopment ();
		usePlaceholders = !GrowerSpriteContainer.instance.HasArray (id);
		if (usePlaceholders) {
			InitGameSprite (8, GetDepth (), false);
		} else {
			InitGameSprite (8, GetDepth (), false, GrowerSpriteContainer.instance.GetGrowerArray (id), null);
			//boxCollider.center = GrowerSpriteContainer.instance.GetColliderCenter (id);
			boxCollider.size = GrowerSpriteContainer.instance.GetColliderSize (GetScale ());
		}
		
		myTransform.position.x = plotPosition.transform.position.x;
		myTransform.position.y = plotPosition.transform.position.y;
		
		SetColor (Color.white);
		SetTexture (0);
		Hide ();
		grower.SetGrowerSprite (this);
		
		StartBuilding ();
		SetCost ();
		
		/*wNotification = Instantiate (wNotification);
		
		var wPosition = MainCamera.GetPosition (myTransform.position);
		//wNotification.InitTextNotification (wPosition.x, wPosition.y, wPosition.y - 0.05, 0.75);
		wNotification.InitTextNotification (0.5, 0.5, 0.5 - 0.05, 0.75);
		InvokeRepeating ("ShowNotification", 0.1, 5.0);*/
	}
	
	function ShowNotification () {
		wNotification.ShowNotification ("+$5");
	}
	
	private function GetDepth () : float {
		var far : float = 1.0;
		var mid : float = 0.5;
		switch (id) {
			case 0 : return 0.0;
			case 1 : return far;
			case 2 : return mid;
			case 3 : return 0.0;
			case 4 : return -mid;
			case 5 : return -far;
			case 6 : return -mid;
			case 7 : return 0.0;
			case 8 : return mid;
		}
		return -1.0;
	}
	
	public function SelectYes () {
		if (GameController.instance.BuildGrower (grower)) {
			StartBuilding ();
		}
	}
	
	public function StartBuilding () {
		CreateScaffolding ();
		CreateDevTimer ();
		building = true;
		StartCoroutine (CoBuild ());
	}
	
	public function OnStopBuilding (time : float, eTime : float, action : Grower.BuildAction) {
		DestroyScaffolding ();
		DestroyDevTimer ();
		building = false;
		if (!development.Damaged) {
			if (usePlaceholders) {
				SetColor (Color.white);
			} else {
				SetTextures (GrowerSpriteContainer.instance.GetGrowerArray (id));
			}
		}	
		SetVersionTexture ();
		SetCost ();
	}
	
	public function OnShockDamage () {
		if (usePlaceholders) {
			SetColor (Color.red);
		} else {
			SetTextures (GrowerSpriteContainer.instance.GetGrowerBrokenArray (id));
		}
		SetVersionTexture ();
		SetCost ();
		showMenu = true;
	}
	
	private function SetVersionTexture () {
		SetTexture (development.Version - 1);
		if (Alpha == 0.0) Show ();
		boxCollider.size = GrowerSpriteContainer.instance.GetColliderSize (GetScale ());
		if (development.Version == 2) {
			SetAnchor (GrowerSpriteContainer.instance.GetAnchorPosition (id));
			myTransform.position.x = plotPosition.transform.position.x;
			myTransform.position.y = plotPosition.transform.position.y;
		}
	}
		
	private function CreateDevTimer () {
		myDevTimer = PoolManager.instance.Instantiate (devTimer, plotPosition.position, Quaternion.identity).GetComponent (GrowerDevTimer);
		myDevTimer.transform.parent = myTransform.parent;
		myDevTimer.Create (8, GetDepth () -0.2);
		//myDevTimer.SpriteTransform.localPosition.y = plotPosition.position.y - 0.2;
	}
	
	private function DestroyDevTimer () {
		if (myDevTimer == null) return;
		myDevTimer.Destroy ();
		myDevTimer = null;
	}
	
	private function CreateScaffolding () {
		myScaffolding = PoolManager.instance.Instantiate (scaffolding, plotPosition.position, Quaternion.identity).GetComponent (Scaffolding);
		myScaffolding.transform.parent = myTransform.parent;
		myScaffolding.Create (8, GetDepth () - 0.1);
		showMenu = false;
	}
	
	private function DestroyScaffolding () {
		if (myScaffolding == null) return;
		myScaffolding.Destroy ();
		myScaffolding = null;
		if (!development.FullyDeveloped) showMenu = true;
	}
	
	private function SetCost () {
		Cost = (development.Damaged) ? development.CopeCost : development.GetNextVersionCost ();
	}
	
	private function CoBuild () {
		while (building) {
			myDevTimer.SetProgress (grower.BuildProgress);
			yield;
		}
	}
	
	public function OnCreateMenu () {
		Level = "Level " + development.Version + " Pod";
		if (development.Damaged) {
			Action = "Repair";
			Health = development.Health;
		} else {
			Action = "Upgrade";
			Health = 1.0;
		}
	}
	
	public function Reset () {
		building = false;
		DestroyScaffolding ();
		DestroyDevTimer ();
		PoolManager.instance.Destroy (gameObject);
	}
}