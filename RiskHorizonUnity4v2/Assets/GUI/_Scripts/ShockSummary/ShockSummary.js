#pragma strict

class ShockSummary extends MonoBehaviour {
	
	public var button : GameObject;
	public var screen : ShockSummaryScreen;
	public var text : ShockSummaryText;
	public var shockText : ShockSummaryShockText;
	public var advance : ShockSummaryAdvanceButton;
	public var infoBox : ShockSummaryInfoBox;
	public var fillBar : ShockSummaryFillBar;
	
	private var reports : ShockReport[];
	private var buttons : ShockButton[] = new ShockButton[0];
	private var fillBars : ShockSummaryFillBar[] = new ShockSummaryFillBar[4];
	
	private var codes : LevelCodes = new LevelCodes ();
	
	function Awake () {
		screen = Instantiate (screen);
		shockText = Instantiate (shockText);
		text = Instantiate (text);
		//advance = Instantiate (advance);
		//advance.Create (this);
		/*infoBox = Instantiate (infoBox);
		for (var i = 0; i < fillBars.Length; i ++) {
			fillBars[i] = Instantiate (fillBar);
			var y : float = -0.2 + (i * 0.1);
			fillBars[i].transform.position = MainCamera.SetPositionV3 (0.0, y, 0.0);
		}*/
		Hide ();
	}
	
	public function Show (_reports : ShockReport[], won : boolean) {
		
		screen.gameObject.SetActiveRecursively (true);
		advance.gameObject.SetActiveRecursively (true);
		advance.Show ();
		
		shockText.SetText ("");
		var level : int = GameController.instance.GetLevel ();
		var c : String = codes.GetRandomCodeFromLevel (level);
		var te : TextEditor = new TextEditor ();
		te.content = new GUIContent (c);
		te.SelectAll ();
		te.Copy ();
		
		if (won) {
			text.SetText ("BEAT LEVEL " + level.ToString () + "\nCongratulations!.\nClick on meteors to learn.");
		} else {
			text.SetText ("LOST LEVEL " + level.ToString () + "\nYou've lost! Your code is " + c + ". Write it into the MOOC.\nclick meteors TO LEARN");
		}
		
		reports = _reports;
		buttons = new ShockButton[0];
		
		var y : float = MainCamera.GetHeight () * 0.5;
		var separation : float = MainCamera.GetHeight () * 0.33;
		var v30 : Vector3 = new Vector3 (0.0, 0.0, 0.0);
		for (var i = 0; i < reports.Length; i ++) {
			var x : float = (MainCamera.GetHeight () * -0.8) + (i * separation);
			var b : ShockButton = PoolManager.instance.Instantiate (button, v30, Quaternion.identity).GetComponent (ShockButton);
			//b.Create (this, new Vector2 (x, y), reports[i].ID, reports[i].Hit);
			buttons = AppendArray (buttons, b);
		}
	}
	
	private function Hide () {
		screen.gameObject.SetActiveRecursively (false);
		shockText.SetText ("");
		text.SetText ("");
		advance.gameObject.SetActiveRecursively (false);
		/*infoBox.gameObject.SetActiveRecursively (false);
		for (var i = 0; i < fillBars.Length; i ++) {
			fillBars[i].Deactivate ();
		}*/
		PoolManager.instance.DestroyAll (button);
	}
	
	public function SelectShock (id : int) {
		var t : String = FindReport (id).GetReport ();
		shockText.SetText (t);
		
		/*var report : ShockReport = FindReport (id);
		infoBox.gameObject.SetActiveRecursively (true);
		infoBox.Show (report);
		ShowBars (report);*/
	}
	
	private function ShowBars (report : ShockReport) {
		/*var yStart : float = (report.Hit) ? -0.2 : -0.3;
		for (var i = 0; i < fillBars.Length; i ++) {
			fillBars[i].gameObject.SetActiveRecursively (true);
			fillBars[i].transform.position.y = MainCamera.height * (yStart + (i * 0.1));
		}
		fillBars[0].Show ((report.Severity + 0.0) * 0.1, false);
		fillBars[1].Show ((report.HitProbability + 0.0) * 0.01, false);
		fillBars[2].Show ((report.Research + 0.0) * 0.01, false);
		fillBars[3].Show ((report.Protection + 0.0), false);
		
		Debug.Log ((report.Severity + 0.0) * 0.1);
		Debug.Log ((report.HitProbability + 0.0) * 0.01);
		Debug.Log ((report.Research + 0.0) * 0.01);
		Debug.Log ((report.Protection + 0.0));*/
	}
	
	private function FindReport (id : int) : ShockReport {
		for (var i = 0; i < reports.Length; i ++) {
			var r : ShockReport = reports[i];
			if (r.ID == id) return r;
		}
		Debug.Log ("Couldn't find " + id);
		return null;
	}
	
	public function OnAdvance (won : boolean) {
		Hide ();
	}
	
	private function AppendArray (arr : ShockButton[], newVal : ShockButton) : ShockButton[] {
		var newLength : int = arr.Length + 1;
		var newArr : ShockButton[] = new ShockButton[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
}