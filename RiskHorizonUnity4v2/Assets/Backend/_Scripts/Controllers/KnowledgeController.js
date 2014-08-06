#pragma strict

class KnowledgeController extends MonoBehaviour {
	
	// Debugging
	
	public var debug : boolean = true;
	
	/*function OnGUI () {
		if (!debug) return;
		GUI.color = (GameState.CheckState (State.Knowledge)) ? Color.yellow : Color.white;
		var s : String = (GameState.CheckState (State.Knowledge)) ? "\nPress a number to view the shock\nCosts $1" : "";
		GUI.Label (new Rect (20, 160, 200, 60), "[K] Knowledge" + s);
	}*/
}