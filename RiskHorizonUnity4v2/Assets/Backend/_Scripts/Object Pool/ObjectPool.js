#pragma strict

class ObjectPool extends System.Object {
	
	public var obj : GameObject;
	private var objs : GameObject[] = new GameObject[0];
	
	public function ObjectPool (_obj : GameObject) {
		obj = _obj;
	}
	
	public function Instantiate (position : Vector3, rotation : Quaternion) : GameObject {
		
		if (objs.Length == 0) {
			return AddObject (position, rotation);
		}
		
		for (var i = 0; i < objs.Length; i ++) {
			if (!objs[i].active) {
				objs[i].SetActiveRecursively (true);
				objs[i].transform.position = position;
				objs[i].transform.rotation = rotation;
				return objs[i];
			}
		}
		
		return AddObject (position, rotation);
	}
	
	public function Destroy (o : GameObject, t : float) {
		yield WaitForSeconds (t);
		Destroy (o);
	}
	
	public function Destroy (o : GameObject) {
		for (var i = 0; i < objs.Length; i ++) {
			if (objs[i].transform == o.transform)
				o.SetActiveRecursively (false);
		}
	}
	
	public function DestroyAll () {
		for (var i = 0; i < objs.Length; i ++) {
			objs[i].SetActiveRecursively (false);
		}
	}
	
	public function GetObjects () : GameObject[] {
		var os : GameObject[] = new GameObject[0];
		for (var i = 0; i < objs.Length; i ++) {
			if (objs[i].active)
				os = ResizeArray (os, objs[i]);
		}
		return os;
	}
	
	private function AddObject (position : Vector3, rotation : Quaternion) : GameObject {
		var newObj : GameObject = GameObject.Instantiate (obj, position, rotation);
		objs = ResizeArray (objs, newObj);
		return objs[objs.Length - 1];
	}
	
	private function ResizeArray (array : GameObject[], newObject : GameObject) : GameObject[] {
		var newArray : GameObject[] = new GameObject[array.Length + 1];
		for (var i = 0; i < array.Length; i ++) {
			newArray[i] = array[i];
		}
		newArray[newArray.Length - 1] = newObject;
		return newArray;
	}
	
}