#pragma strict

class Messenger extends MonoBehaviour {
	
	private var listenerContainers : ListenerContainer[] = new ListenerContainer[0];
	static var instance : Messenger;
	
	function Awake () {
		if (instance == null) instance = this;
		//DontDestroyOnLoad (this);
	}
	
	public function Listen (call : String, go : GameObject) {
		FindListenerContainer (call).AddListener (go);
	}
	
	public function Listen (call : String, component : Component) {
		Listen (call, component.gameObject);
	}
	
	public function Send (call : String) {
		//FindListenerContainer (call, false).Send ();
		FindListenerContainer (call).Send ();
	}
	
	function FindListenerContainer (call : String, createNew : boolean) : ListenerContainer {
		if (createNew) return FindListenerContainer (call);
		for (var i : int = 0; i < listenerContainers.Length; i ++) {
			if (listenerContainers[i].Call == call)
				return listenerContainers[i];
		}
		Debug.LogError (String.Format ("Message '{0}' does not exist!", call));
		return null;
	}
	
	private function FindListenerContainer (call : String) : ListenerContainer {
		
		if (listenerContainers.Length == 0) 
			return AddListenerContainer (call);
		
		for (var i : int = 0; i < listenerContainers.Length; i ++) {
			if (listenerContainers[i].Call == call)
				return listenerContainers[i];
		}
		
		return AddListenerContainer (call);
	}
	
	private function AddListenerContainer (call : String) : ListenerContainer {
		var lc : ListenerContainer = new ListenerContainer (call);
		listenerContainers = AppendArray (listenerContainers, lc);
		return lc;
	}
	
	private function AppendArray (array : ListenerContainer[], newListenerContainer : ListenerContainer) : ListenerContainer[] {
		var newArray : ListenerContainer[] = new ListenerContainer[array.Length + 1];
		for (var i = 0; i < array.Length; i ++) {
			newArray[i] = array[i];
		}
		newArray[newArray.Length - 1] = newListenerContainer;
		return newArray;
	}
}