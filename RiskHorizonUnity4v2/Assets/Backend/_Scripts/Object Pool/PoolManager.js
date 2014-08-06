#pragma strict

// To instantiate an object, call PoolManager.instance.Instantiate (object, position, rotation);
// To destroy an object, call PoolManager.instance.Destroy (object); or optionally PoolManager.instance.Destroy (object, delay);

class PoolManager extends MonoBehaviour {
	
	public var objects : GameObject[];
	private var pools : ObjectPool[];
	static var instance : PoolManager;
	
	function Awake () {
		
		if (instance == null) instance = this;
		
		pools = new ObjectPool[objects.Length];
		for (var i = 0; i < pools.Length; i ++) {
			pools[i] = new ObjectPool (objects[i]);
		}
	}
	
	public function Instantiate (obj : GameObject, position : Vector3, rotation : Quaternion) : GameObject {
		return GetPool (obj).Instantiate (position, rotation);
	}
	
	public function Destroy (obj : GameObject) {
		GetPool (obj).Destroy (obj);
	}
	
	public function DestroyAll (obj : GameObject) {
		GetPool (obj).DestroyAll ();
	}
	
	public function GetObjects (obj : GameObject) : GameObject[] {
		return GetPool (obj).GetObjects ();
	}
	
	private function GetPool (obj : GameObject) {
		for (var i = 0; i < pools.Length; i ++) {
			if (pools[i].obj.name == obj.name || pools[i].obj.name + "(Clone)" == obj.name) {
				return pools[i];
			}
		}
		Debug.Log (obj.name + " pool doesn't exist. Make sure to add the object you want to instantiate to the PoolManager!");
		return null;
	}
}