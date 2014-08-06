#pragma strict

class FillBar extends Scalable {
	
	/*private var smallScreen : boolean = true;
	public function get SmallScreen () : boolean { return smallScreen; }*/
	
	public var fill : GameSprite;
	public var question : GameSprite;
	
	private var fillCount : int = 10;
	private var fills : GameSprite[];
	private var activeFills : boolean[];
	private var fillPositions : Vector3[];
	
	private var hasQuestions : boolean = false;
	private var questions : GameSprite[];
	private var activeQuestions : boolean[];
	private var questionRange : int = 1;
	
	private var rightToLeft : boolean = false;
	private var animating : boolean = false;
	
	private var createdFills : boolean  = false;
	
	public function CreateFills (_fillCount : int, separation : float, vertical : boolean) {
		
		fillCount = _fillCount;
		fills = new GameSprite[fillCount];
		activeFills = new boolean[fillCount];
		fillPositions = new Vector3[fillCount];
		
		hasQuestions = (question != null);
		questions = new GameSprite[fillCount];
		activeQuestions = new boolean[fillCount];
		
		if (UseSmallScreen ()) separation *= 0.8;
		separation *= MainCamera.scale;
		
		var positions : Vector2[] = new Vector2[10];
		
		for (var i = 0; i < 10; i ++) {
			fills[i] = Instantiate (fill);
			fills[i].transform.parent = transform;
			var y : float = (vertical) ? i * separation : 0;
			var x : float = (vertical) ? 0 : i * separation;
			fills[i].transform.localPosition = new Vector3 (x, y, 0.0);
		}
		
		CreateFills (separation, vertical);
	}
	
	function CreateFills (separation : float, vertical : boolean) {
		yield WaitForFixedUpdate ();
		for (var i = 0; i < 10; i ++) {
			SetFillTexture (i);
			fills[i].transform.localPosition.z = fills[i].Depth;
			activeFills[i] = false;
			fills[i].Hide ();
		}
		createdFills = true;
	}
	
	public function SetPosition (position : Vector2, local : boolean) {
		SetPosition (position, local, true, true);
	}
	
	public function SetPosition (position : Vector2, local : boolean, useDefaultRatio : boolean, useDefaultHeight : boolean) {
		if (UseSmallScreen ()) {
			position.x *= 0.8;
			position.y *= 0.8;
		}
		if (local) transform.localPosition = MainCamera.SetPositionV3 (position.x, position.y, transform.localPosition.z, useDefaultRatio, useDefaultHeight);
		else 	   transform.position = MainCamera.SetPositionV3 (position.x, position.y, transform.position.z, useDefaultRatio, useDefaultHeight);
	}
	
	public function SetZPosition (layer : int, offset : float) {
		for (var i = 0; i < fills.Length; i ++) {
			fills[i].SetZPosition (layer, offset);
		}
	}
	
	private function SetFillTexture (index : int) {
		if (index < 3) fills[index].SetTexture (0);
		else if (index < 7) fills[index].SetTexture (1);
		else fills[index].SetTexture (2);
	}
	
	public function SetProgress (progress : float) {
		ResetActiveFills ();
		if (hasQuestions) ResetQuestionMarks ();
		var activeFillCount : int = Mathf.Clamp (Mathf.RoundToInt (progress * 10.0), 0, fillCount);
		for (var i = 0; i < activeFillCount; i ++) {
			if (rightToLeft) {
				var reverse : int = Mathf.Abs (i - (fillCount - 1));
				activeFills[reverse] = true;
			} else {
				activeFills[i] = true;
			}
		}
		
		if (hasQuestions) UpdateQuestionMarkRange ();
	}
	
	public function Deactivate () {
		if (gameObject.activeSelf) Deactivate (true);
	}
	
	public function Deactivate (deactivateThis : boolean) {
		while (!createdFills) { yield; }
		Hide ();
		if (deactivateThis) gameObject.SetActive (false);
	}
	
	public function FadeIn (fadeTime : float) {
		for (var i = 0; i < fillCount; i ++) {
			if (activeFills[i]) fills[i].FadeIn (fadeTime);
		}
	}
	
	public function FadeOut (fadeTime : float) {
		for (var i = 0; i < fillCount; i ++) {
			if (activeFills[i]) fills[i].FadeOut (fadeTime);
		}
	}
	
	public function Hide () {
		for (var i = 0; i < fillCount; i ++) {
			fills[i].Hide ();
			if (hasQuestions) questions[i].Hide ();
		}
	}
	
	public function Show () {
		for (var i = 0; i < fillCount; i ++) {
			if (activeFills[i]) fills[i].Show ();
			if (hasQuestions) {
				if (activeQuestions[i]) questions[i].Show ();
			}
		}
	}
	
	public function Show (progress : float, animate : boolean) {
		if (animate) {
			SetProgress (progress);
			StartCoroutine (CoShow ());
		} else {
			if (animating) return;
			SetProgress (progress);
			Show ();
		}
	}
	
	public function SetQuestionMarkRange (qr : float) {
		qr *= 0.5;
		qr = Mathf.RoundToInt (qr * 10.0);
		questionRange = qr;
	}
	
	private function ResetQuestionMarks () {
		for (var i = 0; i < fillCount; i ++) {
			activeQuestions[i] = false;
			questions[i].Hide ();
		}
	}
	
	private function UpdateQuestionMarkRange () {
		
		if (!hasQuestions) return;
		
		var activeFillCount : int = ActiveFillCount ();
		var min : int = Mathf.Max (0, activeFillCount - questionRange);
		var max : int = Mathf.Min (activeFillCount + questionRange - 1, fillCount - 1);
		
		for (var i = 0; i < fillCount; i ++) {
			if (questionRange == 0) {
				activeQuestions[i] = false;
				continue;
			}
			
			if (i >= min && i <= max) {
				activeQuestions[i] = true;
			} else {
				activeQuestions[i] = false;
			}
		}
	}
	
	private function CoShow () {
		if (animating) return;
		animating = true;
		
		var shown : int = 0;
		while (shown < ActiveFillCount () && animating) {
			if (activeFills[shown]) fills[shown].Show ();
			shown ++;
			yield WaitForSeconds (0.1);
		}
		animating = false;
	}
	
	private function ResetActiveFills () {
		for (var i = 0; i < fillCount; i ++) {
			activeFills[i] = false;
			fills[i].Hide ();
		}
	}
	
	private function ActiveFillCount () : int {
		var count : int = 0;
		for (var i = 0; i < fillCount; i ++) {
			if (activeFills[i]) count ++;
		}
		return count;
	}
}