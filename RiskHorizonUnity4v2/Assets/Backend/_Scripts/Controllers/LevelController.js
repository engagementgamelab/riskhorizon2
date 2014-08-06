#pragma strict

class LevelController extends MonoBehaviour {
	
	// <debugging>
	public var debug : boolean = false;
	private var won : boolean = false;
	private var lost : boolean = false;
	// </debugging>
	
	private var level : int = 0;
	private var levelCount : int = 6;
	
	public function get Level () : int { return level; }
	public function get LastLevel () : boolean { return (level == levelCount); }
	
	public function StartLevel () : int {
		won = false;
		level ++;
		return level;
	}
	
	public function EndLevel (w : boolean) {
		if (w) won = true;
		else lost = true;
	}
	
	public function Reset () {
		level = 0;
		won = false;
		lost = false;
	}
	
	public function ResetLevel () {
		level -= 1;
		won = false;
		lost = false;
	}
	
	// -------------------- Debugging -------------------- //
	
	/*function OnGUI () {
		if (!debug) return;
		if (!won && !lost) return;
		var s : String = (won) ? "WON!! Press spacebar\nfor next level" : "lost it ugh :(\nspacebar to reset ok";
		GUI.Label (new Rect (600, 20, 200, 40), s);
	}*/
}