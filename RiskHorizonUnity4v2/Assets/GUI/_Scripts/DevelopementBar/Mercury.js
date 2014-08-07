#pragma strict

class Mercury extends GameSprite {
	
	var maxFill : float = 460;
	var startFill : float = 120;
	var devSpeed : float = 0;
	var test : float;
	
	public var glass : DevGlass;
	public var bob : Bob;
	public var goalLine : GoalLine;
	public var goalLineObject : GameObject;
	private var goalLines : GoalLine[] = new GoalLine[0];
	
	private var scale : float = 0.0;
	private var changingScale : boolean = false;
	private var targetDevSpeed : float;
	private var settingColor : boolean = false;
	
	private var startY : float;
	private var cutoff : float = 0.0;
	private var min : float = 0.075;
	private var max : float = 0.99;
	private var goal : float = 0.67;
	
	private var testLevel : int = 1;
	private var activated : boolean = true;
	
	private var resetLevel : boolean = false;
	
	public function get DevSpeed () : float { return devSpeed; }
	
	function Awake () {
		SpriteTransform = transform;
		SetZPosition (4, 0.5);
	}
	
	function Start () {
		SpriteTransform.position = MainCamera.SetPositionV3 (-0.9, 0.1, Depth, false);
		startY = SpriteTransform.position.y;
		
		if (UseSmallScreen () && texturesSmall.Length > 0) {
			renderer.material.SetTexture ("_MainTex", texturesSmall[0]);
			SpriteTransform.localScale.x = 124;
			SpriteTransform.localScale.y = 900;
		} else {
			SpriteTransform.localScale.x = 56;
			SpriteTransform.localScale.y = 455;
		}
		
		var scale : float = MainCamera.scale;
		SpriteTransform.localScale.x *= scale;
		SpriteTransform.localScale.y *= scale;
		
		SetCutoff (min);
		Messenger.instance.Listen ("reset level", this);
		Messenger.instance.Listen ("start level", this);
		DelayedStart ();
	}
	
	function DelayedStart () {
		yield WaitForFixedUpdate ();
		var p : float = Mathf.Lerp (min, max, ScaledProgress (1.0));
		goalLine.SetProgress (p);
	}
	
	function SetPercent () {
		if (changingScale) return;
		changingScale = true;
		
		var progress : float = GameController.instance.GetDevGoalProgress ();
		var normalProgress : float = ScaledProgress (progress);
		
		while (Mathf.Abs (cutoff - normalProgress) > 0.01) {
			progress = GameController.instance.GetDevGoalProgress ();
			if (progress >= 1.0) {
				goalLine.SetGoalMet ();
			} else {
				goalLine.SetGoalLost ();
			}
			normalProgress = ScaledProgress (progress); 
			cutoff = Mathf.Lerp (cutoff, normalProgress, 0.1);
			var c2 = Mathf.Lerp (min, max, cutoff);
			SetCutoff (c2);
			yield;
		}
		changingScale = false;
	}
	
	private function Flip01 (val : float) : float {
		return Mathf.Abs (val - 1.0);
	}
	
	private function SetCutoff (val : float) {
		bob.SetProgress (val);
		val = Flip01 (val);
		renderer.material.SetFloat ("_Cutoff", val + 0.015);
	}
	
	function ChangeColor () {
		if (settingColor) return;
		settingColor = true;
		while (Mathf.Abs (devSpeed - targetDevSpeed) > 0.01) {
			devSpeed = Mathf.Lerp (devSpeed, targetDevSpeed, 0.1);
			SetColor (GetColor ());
			yield;
		}
		devSpeed = targetDevSpeed;
		SetColor (GetColor ());
		settingColor = false;
	}
	
	public function GetColor () {
		if (devSpeed < 0.5) {
			return Color.Lerp (Color.red, Color.yellow, devSpeed * 2);
		} else {
			return Color.Lerp (Color.yellow, Color.green, Mathf.InverseLerp (0.5, 1.0, devSpeed));
		}
	}
	
	public function SetColor (c : Color) {
		renderer.material.color = c;
		bob.renderer.material.color = c;
	}
	
	public function HideMercury () {
		Hide ();
		activated = false;
	}
	
	public function ShowMercury () {
		Show ();
		activated = true;
	}
	
	function Update () {
		if (!activated) return;
		targetDevSpeed = GameController.instance.GetDevRate () / Mathf.Max (0.0001, (GameController.instance.GetDevTargetRate () * 2.0));
		ChangeColor();
		scale = GameController.instance.GetDevGoalProgress () * maxFill;
		SetPercent ();
	}
	
	function _ResetLevel () {
		resetLevel = true;
	}
	
	function _StartLevel () {
		if (resetLevel) {
			resetLevel = false;
			return;
		}
		
		var level : int = GameController.instance.GetLevel ();
		if (level == 1) {
			PoolManager.instance.DestroyAll (goalLineObject);
			goalLines = new GoalLine[0];
			return;
		}
		
		var glo : GameObject = PoolManager.instance.Instantiate (goalLineObject, new Vector3 (0, 0, 0), Quaternion.identity);
		var gl : GoalLine = glo.GetComponent (GoalLine);
		goalLines = AppendArray (goalLines, gl);
		gl.Create (glass);
		gl.SetProgress (ScaledProgress (1.0));
		
		goalLine.Hide ();
		
		var goals : float[] = GameController.instance.GetDevGoals ();
		var target : float = goals[level - 1];
		
		for (var i = 0; i < level - 1; i ++) {
			var p : float = Mathf.Lerp (min, max, ScaledProgress (goals[i] / target));
			goalLines[i].SetProgress (p, true);
		}
		
		if (GameController.instance.tutorialLevel) return;
		yield WaitForSeconds (1.5);
		goalLine.FadeIn (1.0);
	}
	
	private function ScaledProgress (val : float) {
		return Mathf.InverseLerp (0.0, 1.0 + (1.0 - goal), val);
	}
	
	private function AppendArray (arr : GoalLine[], newVal : GoalLine) : GoalLine[] {
		var newLength : int = arr.Length + 1;
		var newArr : GoalLine[] = new GoalLine[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
}