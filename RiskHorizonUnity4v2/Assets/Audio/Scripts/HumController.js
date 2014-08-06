#pragma strict

class HumController extends MonoBehaviour {
	
	public var hum : Hum;
	private var hums : Hum[];
	private var humCount : int = 9;
	private var activeHums : boolean[];
	
	function Awake () {
		activeHums = new boolean[humCount];
		hums = new Hum[humCount];
		for (var i = 0; i < humCount; i ++) {
			hums[i] = Instantiate (hum);
			hums[i].transform.parent = transform;
			hums[i].CreateHum (i);
		}
	}
	
	public function PlayHum (grower : Grower) {
		var index : int = grower.ID;
		hums[index].PlayHum (grower.GetDevelopment ().Version);
		activeHums[index] = true;
	}
	
	public function PlayHums () {
		for (var i = 0; i < humCount; i ++) {
			if (activeHums[i]) hums[i].FadeInHum ();
		}
	}
	
	public function StopHums () {
		for (var i = 0; i < humCount; i ++) {
			if (activeHums[i]) hums[i].FadeOutHum ();
		}
	}
	
	public function Reset () {
		for (var i = 0; i < humCount; i ++) {
			if (activeHums[i]) hums[i].StopHum ();
			activeHums[i] = false;
		}
	}
}