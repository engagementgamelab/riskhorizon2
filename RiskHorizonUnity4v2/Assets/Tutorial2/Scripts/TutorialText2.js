#pragma strict

class TutorialText2 extends MonoBehaviour {
	
	class Textbox extends System.Object {
		
		private var id : String;
		private var content : String;
		private var wait : boolean;
		private var nextButton : boolean;
		private var disableActions : boolean;
		public var disabledActions : boolean[] = [
			false,	// Development
			false,	// Protection
			false,	// Insurance
			false	// Knowledge
		];
		private var background : int;
		private var position : Vector2;
		
		public function get ID () : String { return id; }
		public function get Content () : String { return content; }
		public function get Wait () : boolean { return wait; }
		public function get NextButton () : boolean { return nextButton; }
		public function get DisableActions () : boolean { return disableActions; }
		public function get DisabledActions () : boolean[] { return disabledActions; }
		public function get Background () : int { return background; }
		public function get Position () : Vector2 { return position; }
		
		public function Textbox (_id : String, _content : String, _wait : boolean, _nextButton : boolean, _background : int, _position : Vector2) {
			id = _id;
			content = _content;
			wait = _wait;
			nextButton = _nextButton;
			disableActions = false;
			background = _background;
			position = _position;
		}
		
		public function Textbox (_id : String, _content : String, _wait : boolean, _nextButton : boolean, _disabledActions : boolean[], _background : int, _position : Vector2) {
			id = _id;
			content = _content;
			wait = _wait;
			nextButton = _nextButton;
			disableActions = true;
			disabledActions = _disabledActions;
			background = _background;
			position = _position;
		}
	}
	
	private var textboxes : Textbox[];
	
	private var content : String[] = [
		"Welcome to Alora!\nClick here to build a pod!",
		"This is your wealth pool. Almost all actions in the game cost wealth.",
		"To beat the level you must reach the line indicated on this development meter. Fill the meter by building and upgrading pods.",
		"Reach your development goal before the round ends.",
		"Upgraded pods fill your meter faster and increase the amount of wealth you make. Click on the pod to upgrade.",
		"If your meter is red, you won't reach your goal in time. Turn it green by building more pods.Try doing that now.",
		"You're doing great! If you keep your meter green you will reach your goal, but comets threaten to push you back into the red. Click the comet to learn more.",
		"This meter predicts how much damage the comet will cause.",
		"This meter predicts the chance of the comet hitting.",
		"Your predictions become more accurate the longer you observe the comet.",
		"Whew. That comet missed. But you won't always be so lucky. You need to prepare for the risk of a hit.",
		"When comets hit they cause waves. Click and hold to raise your village and protect against this threat. Raise it until the first bar lights up.",
		"Remember the severity meter? Now let's try using that information to protect yourself.",
		"Protect until the meter matches the comet's severity. (Hint: light up 4 bars)",
		"When a comet hits, there's one last chance to protect by making community connections.",
		"The more you invested in research, the more time you have now.",
		"Click and drag from one glow to the next. Each connection adds to your protection. Make as many as you can!",
		"Great! Thanks to your efforts, you increased your protection by ",
		"Congratulations! You were not damaged because you matched your protection level to the comet's severity.",
		"Now try to protect against this more severe comet. Click to learn more.",
		"Ouch! You took quite a hit. Click on your pods to repair them.",
		"You don't develop as fast if your pods are damaged, so always repair them.",
		"Insurance prepares you for high severity comets! Click the button to buy a plan.",
		"Repairing is cheaper because you bought insurance.",
		"Insurance also replenishes some of your lost development.",
		"Balancing your development with protecting against comets is the key to success.",
		"Progress through six levels to beat the game. Remember to keep your eyes on the horizon!"
	];
	
	private var nagBoxes : Textbox[];
	
	private var nags : String[] = [
		"Build more pods!",
		"Keep holding protection!",
		"Connect the glows!",
		"Buy a plan!"
	];
	
	function Awake () {
		textboxes = new Textbox[31];
		textboxes[0] = new Textbox ("Build Grower", content[0], false, false, 2, new Vector2 (0.19, 0.48));
		textboxes[1] = new Textbox ("Wealth", content[1], false, true, [true, true, true, true], 11, new Vector2 (-0.31, -0.35));
		textboxes[2] = new Textbox ("Development Bar", content[2], false, true, [true, true, true, true], 27, new Vector2 (-0.39, 0.385));
		textboxes[3] = new Textbox ("Clock", content[3], true, true, [true, true, true, true], 11, new Vector2 (-0.46, -0.35));
		textboxes[4] = new Textbox ("Upgrading", content[4], false, false, [false, true, true, true], 2, new Vector2 (0.19, 0.48));
		textboxes[5] = new Textbox ("Grower Challenge", content[5], true, true, [true, true, true, true], 27, new Vector2 (-0.39, -0.35));
		textboxes[6] = new Textbox ("View Comet", content[6], true, false, [true, true, true, false], 24, new Vector2 (0.54, 0.35));
		textboxes[7] = new Textbox ("Severity", content[7], true, true, [true, true, true, true], 28, new Vector2 (-0.34, 0.33));
		textboxes[8] = new Textbox ("Chance of Hit", content[8], true, true, [true, true, true, true], 28, new Vector2 (-0.34, 0.13));
		textboxes[9] = new Textbox ("Research", content[9], true, true, [true, true, true, true], 28, new Vector2 (-0.34, -0.07));
		textboxes[10] = new Textbox ("Shock Missed", content[10], true, true, [true, true, true, true], 27, new Vector2 (0.08, 0.66));
		textboxes[11] = new Textbox ("Protection", content[11], true, false, [true, false, true, true], 8, new Vector2 (0.43, -0.25));
		textboxes[12] = new Textbox ("Match Severity", content[12], true, true, [true, true, true, true], 28, new Vector2 (-0.34, 0.33));
		textboxes[13] = new Textbox ("Match Protection", content[13], true, false, [true, false, true, true], 8, new Vector2 (0.43, -0.22));
		textboxes[14] = new Textbox ("Mini Game Intro", content[14], true, true, [true, true, true, true], 30, new Vector2 (0.18, 0.0));
		textboxes[15] = new Textbox ("Mini Game Clock", content[15], true, true, [true, true, true, true], 14, new Vector2 (-0.06, -0.37));
		textboxes[16] = new Textbox ("Mini Game Connections", content[16], true, true, [true, true, true, true], 30, new Vector2 (0.17, 0.0));
		textboxes[17] = new Textbox ("Mini Game End", content[17], true, true, [true, true, true, true], 8, new Vector2 (0.43, -0.25));
		textboxes[18] = new Textbox ("No Damage", content[18], true, true, [true, true, true, true], 30, new Vector2 (0.18, 0.0));
		textboxes[19] = new Textbox ("Impossible Shock", content[19], true, false, [true, true, true, false], 24, new Vector2 (0.54, 0.35));
		textboxes[20] = new Textbox ("Damaged", content[20], true, true, [true, true, true, true], 2, new Vector2 (0.19, 0.48));
		textboxes[21] = new Textbox ("Fixed", content[21], true, true, [true, true, true, true], 30, new Vector2 (0.18, 0.0));
		textboxes[22] = new Textbox ("Insurance", content[22], true, false, [true, true, false, true], 8, new Vector2 (0.25, -0.25));
		textboxes[23] = new Textbox ("Insurance Repair", content[23], true, true, [true, true, true, true], 30, new Vector2 (0.0, 0.0));
		textboxes[24] = new Textbox ("Recoup Development", content[24], true, true, [true, true, true, true], 27, new Vector2 (-0.39, 0.0));
		textboxes[25] = new Textbox ("Conclusion", content[25], true, true, [true, true, true, true], 30, new Vector2 (0.18, 0.0));
		textboxes[26] = new Textbox ("Conclusion2", content[26], true, true, [true, true, true, true], 30, new Vector2 (0.18, 0.0));
		
		textboxes[27] = new Textbox ("Nag Build", nags[0], false, false, 29, new Vector2 (0.18, 0.0));
		textboxes[28] = new Textbox ("Nag Protection", nags[1], false, false, 29, new Vector2 (0.35, -0.75));
		textboxes[29] = new Textbox ("Nag Make Connections", nags[2], false, false, 29, new Vector2 (0.18, 0.0));
		textboxes[30] = new Textbox ("Nag Insurance", nags[3], false, false, 29, new Vector2 (0.31, -0.18));
	}
	
	public function GetTextbox (ID : String) : Textbox {
		for (var i = 0; i < textboxes.Length; i ++) {
			if (textboxes[i].ID == ID) return textboxes[i];
		}
		Debug.Log ("couldn't find " + ID);
		return null;
	}
}