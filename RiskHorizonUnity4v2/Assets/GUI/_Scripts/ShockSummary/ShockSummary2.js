#pragma strict

class ShockSummary2 extends GUITextBox {
	
	public var advance : ShockSummaryAdvanceButton;
	public var info : ShockSummaryInfoBox;
	public var button : ShockButton;
	public var retry : ShockSummaryRetryButton;
	
	private var buttons : ShockButton[] = new ShockButton[10];
	private var reports : ShockReport[];
	
	private var severity : GTBFillBar;
	private var chance : GTBFillBar;
	private var research : GTBFillBar;
	private var protection : GTBFillBar;
	
	private var damage : GTBText;
	private var insurance : GTBText;
	
	private var tips : GTBText;
	private var taleTips : TaleTips;
	private var winText : GTBText;
	private var winMessage : String = "You have done your duty admirably, protected your people from\nthe mightiest comets, met every goal, and developed a thriving\ncommunity that will endure for generations. You will surely go\ndown in history as one of the great Luminators of our time.\n\nMay your skill and achievements be a lesson for every Luminator\nthat comes after you, both here on Alora, and in far off galaxies\nwhere the path of balance is needed most.\n\nGo, Luminator, and grow your glow!";
	
	private var levelCodes : LevelCodes = new LevelCodes ();
	
	private var scale : float = 1.0;
	
	function Awake () {
		InitGTB (3, new Vector2 (0.0, 0.0));
	}
	
	function Start () {
		
		scale = MainCamera.scale;
	
		var textRight : float = -0.95 * scale;
		CreateBackground ();
		CreateText ("Level 1", new Vector2 (0.0, 0.725 * scale), TextSize.Large, TextAnchor.MiddleCenter, true, false);
		CreateText ("Click on the meteors to learn!", new Vector2 (textRight, 0.6 * scale), TextSize.MediumSmall, TextAnchor.UpperLeft, true, false);
		CreateAdvance ();
		CreateInfoBox ();
		CreateButtons ();
		CreateRetry ();
		
		var xFill : float = 0.13 * scale;
		var ySep : float = -0.092 * scale;
		var d : float = (((MainCamera.GetDefaultHeight () * 2.0) + 0.0) / (MainCamera.GetTargetHeight () + 0.0));
		var yStart : float = 0.15 * d * scale * scale;
		severity = CreateFillBar (new Vector2 (xFill, yStart), 38, true, true);
		chance = CreateFillBar (new Vector2 (xFill, yStart + (ySep * 1.0)), 38, true, true);
		research = CreateFillBar (new Vector2 (xFill, yStart + (ySep * 2.0)), 38, true, true);
		protection = CreateFillBar (new Vector2 (xFill, yStart + (ySep * 3.0)), 38, true, true);
		
		var xText : float = 0.45 * scale;
		damage = CreateText ("0%", new Vector2 (xText, yStart + (ySep * 4.0)), TextSize.Medium, TextAnchor.MiddleRight, true, false);
		insurance = CreateText ("None", new Vector2 (xText, yStart + (ySep * 5.0)), TextSize.Medium, TextAnchor.MiddleRight, true, false);
		
		taleTips = new TaleTips (MainCamera.GetDefaultHeight () * 2.0 * 1.67 * scale);
		tips = CreateText ("Tales from the Alorian Insurance Salesman", new Vector2 (textRight, -0.5 * scale), TextSize.MediumSmall, TextAnchor.UpperLeft, true, false);
		winText = CreateText ("", new Vector2 (0.0, 0.0), TextSize.Medium, TextAnchor.MiddleCenter, true, false);
		
		Deactivate ();
	}
	
	private function CreateAdvance () {
		advance = Instantiate (advance);
		advance.Create (this);
	}
	
	private function CreateRetry () {
		retry = Instantiate (retry);
		retry.Create (this);
	}
	
	private function CreateInfoBox () {
		info = Instantiate (info);
		info.Create (Layer);
	}
	
	private function CreateButtons () {
		var separation : float = MainCamera.GetDefaultHeight () * 2.0 * 0.275 * scale;
		var position : Vector2 = new Vector2 (0.0, MainCamera.GetDefaultHeight () * 2.0 * 0.433 * scale);
		for (var i = 0; i < buttons.Length; i ++) {
			position.x = (MainCamera.GetDefaultHeight () * 2.0 * -1.125/*-0.975*/ * scale) + (i * separation); 
			buttons[i] = Instantiate (button);
			buttons[i].Create (this, position);
		}
	}
	
	public function Show (_reports : ShockReport[], won : boolean) {
		
		var scale : float = MainCamera.scale;
		
		if (GameController.instance.GetLastLevel () && won) {
			SetTextContent (0, "Congratulations!");
			SetTextContent (1, "");
			SetTextContent (4, "");
			winText.SetText (winMessage + "\n\n" + "Your Coursera code is " + levelCodes.GetRandomCodeFromLevel (7));
			advance.Show ();
			return;
		}
		
		reports = _reports;
		
		var level : int = GameController.instance.GetLevel ();
		var content : String = (won) ? "Won level " + level.ToString () + "!" : "Lost level " + level.ToString () + "!";
		SetTextContent (0, content);
		SetTextContent (1, "");//"Click on the meteors to learn! Your Coursera code is " + levelCodes.GetRandomCodeFromLevel (level));
		SetTextContent (4, taleTips.GetRandomTip (tips.MyGUIText));
		
		advance.Show ();
		advance.SetAdvancePosition (new Vector2 (1.3 * scale, -1.4 * scale));
		if (level > 1 && !won) {
			retry.Show (won);
			advance.SetAdvancePosition (new Vector2 (0.65 * scale, -0.7 * scale));
		}
		ShowButtons ();
	}
	
	private function ShowButtons () {
		for (var i = 0; i < reports.Length; i ++) {
			buttons[i].gameObject.SetActive (true);
			buttons[i].Show (i, reports[i].Hit);
		}
	}
	
	public function SelectShock (id : int) {
		
		var report : ShockReport = FindReport (id);
		info.gameObject.SetActive (true);
		info.Show (report);
		
		severity.Show (report.Severity, false);
		chance.Show (report.HitProbability, false);
		research.Show (report.Research, false);
		
		var p : float = report.Protection;
		if (report.Hit) p *= report.Multiplier;
		protection.Show (p, false);
		
		ResetText ();
		var totalCopeCost : int = report.TotalCopeCost ();
		var copeCost : int = report.CopeCost;
		var content : String = "";
		if (report.Hit) {
			
			// Damage
			content = report.Damage.ToString ();
			damage.SetText ("$" + totalCopeCost.ToString () + ", " + content + "%");
			
			// Insurance Paid
			var insurancePaid : int = Mathf.Max (0, totalCopeCost - copeCost);
			insurance.SetText ("$" + insurancePaid.ToString ());
		} 
	}
	
	public function OnAdvance (won : boolean) {
		Deactivate ();
	}
	
	public function OnReset () {
		Deactivate ();
	}
	
	public function OnActivate () {
		advance.gameObject.SetActive (true);
		severity.Show (0.0, false);
		chance.Show (0.0, false);
		research.Show (0.0, false);
		protection.Show (0.0, false);
		ResetText ();
	}
	
	private function ResetText () {
		damage.SetText ("");
		insurance.SetText ("");
	}
	
	public function OnDeactivate () {
		advance.gameObject.SetActive (false);
		retry.gameObject.SetActive (false);
		info.gameObject.SetActive (false);
		for (var i = 0; i < buttons.Length; i ++) {
			buttons[i].Deactivate ();
		}
	}
	
	private function FindReport (id : int) : ShockReport {
		for (var i = 0; i < reports.Length; i ++) {
			var r : ShockReport = reports[i];
			if (r.ID == id) return r;
		}
		Debug.Log ("Couldn't find " + id);
		return null;
	}
}