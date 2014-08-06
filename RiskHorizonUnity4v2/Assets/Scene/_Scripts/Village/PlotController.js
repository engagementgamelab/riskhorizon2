#pragma strict

class PlotController extends PlotPositions {
	
	public var plot : GameObject;
	private var plots : Plot[];
	
	private var tutorialLevel : boolean = false;
	
	function Awake () {
		transform.parent = GameObject.Find ("Village").transform;
	}
	
	function OnStart () {
		tutorialLevel = GameController.instance.tutorialLevel;
	}
	
	public function OnSetPosition (p : Vector3) {
		var go : GameObject = PoolManager.instance.Instantiate (plot, p, Quaternion.identity);
		go.transform.parent = transform;
		var plotsGO : GameObject[] = PoolManager.instance.GetObjects (plot);
		plots = new Plot[plotsGO.Length];
		for (var i = 0; i < plots.Length; i ++) {
			plots[i] = plotsGO[i].GetComponent (Plot);
		}
		plots[plots.Length - 1].Create (plots.Length - 1, tutorialLevel);
	}
	
	public function Reset () {
		for (var i = 0; i < plots.Length; i ++) {
			plots[i].Reset ();
		}
	}
	
	public function AllowShowMenus () {
		for (var i = 0; i < plots.Length; i ++) {
			plots[i].AllowShowMenu ();
		}
	}
	
	public function ActivateMenus () {
		for (var i = 0; i < plots.Length; i ++) {
			plots[i].Activated = true;
		}
	}
	
	public function DeactivateMenus () {
		for (var i = 0; i < plots.Length; i ++) {
			plots[i].Activated = false;
		}
	}
}