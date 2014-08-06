#pragma strict

class ListenerContainer extends System.Object {
		
	private var call : String;
	private var functionName : String;
	private var listeners : GameObject[] = new GameObject[0];
	
	function get Call () { return call; }
	function get Listeners () { return listeners; }
	
	function ListenerContainer (_call : String) {
		call = _call;
		SetFunctionName ();
	}
	
	public function AddListener (go : GameObject) {
		listeners = AppendArray (listeners, go);
	}	
	
	public function Send () {
		for (var i : int = 0; i < listeners.Length; i ++) {
			listeners[i].SendMessage (functionName, SendMessageOptions.DontRequireReceiver);
		}
	}
	
	private function SetFunctionName () {
		
		// Takes a call like "button press" and turns it into "_ButtonPress"
		var s : String;
		var chars : char[] = call.ToCharArray ();
		s = chars[0].ToString ().ToUpper ();
		for (var i : int = 1; i < chars.Length; i ++) {
			if (chars[i] == ' ') {
				i ++;
				s += chars[i].ToString ().ToUpper ();
			} else {
				s += chars[i].ToString ().ToLower ();
			}
		}
		functionName = "_" + s;
	}
	
	private function AppendArray (array : GameObject[], newObject : GameObject) : GameObject[] {
		var newArray : GameObject[] = new GameObject[array.Length + 1];
		for (var i = 0; i < array.Length; i ++) {
			newArray[i] = array[i];
		}
		newArray[newArray.Length - 1] = newObject;
		return newArray;
	}
}