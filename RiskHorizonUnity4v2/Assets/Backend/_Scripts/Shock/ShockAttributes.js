#pragma strict

class ShockAttributes extends System.Object {
	
	private var pingingScale : PingingScale;
	
	private var duration : float;
	private var severity : float;
	private var hitProbability : float;
	
	private var estimateRange : float = 0.6;
	private var initialSeverityEstimate : float;
	private var initialHitProbabilityEstimate : float;
	
	private var earlyWarningProgress : float = 0.0;
	
	public function get Duration () : float { return duration; }
	public function get Severity () : float { return severity; }
	public function set Severity (value : float) { severity = value; } // This should only be set by TutorialController2
	public function get HitProbability () : float { return hitProbability; }
	public function get EarlyWarningProgress () : float { return earlyWarningProgress; }
	public function set EarlyWarningProgress (value : float) { 
		earlyWarningProgress = value; 
		pingingScale.UpdateProgress (Mathf.Round (value * 10.0) / 10.0);
	}
	
	public function get EstimateRange () : float { return Mathf.Lerp (estimateRange, 0.0, earlyWarningProgress); }	
	public function get RoundedSeverity () : int { return Mathf.RoundToInt (severity * 10.0); }
	public function get RoundedHitProbability () : int { return Mathf.RoundToInt (hitProbability * 100.0); }
	public function get RoundedEarlyWarningProgress () : int { return Mathf.RoundToInt (earlyWarningProgress * 100.0); }
	
	public function ShockAttributes (_duration : float, _severity : float, _hitProbability : float) {
		duration = _duration;
		severity = _severity;
		hitProbability = _hitProbability;
		
		initialSeverityEstimate = GetRandomValueInRange (severity);
		initialHitProbabilityEstimate = GetRandomValueInRange (hitProbability);
		
		pingingScale = new PingingScale (10, 1.0);
	}
	
	private function GetRandomValueInRange (val : float) : float {
		var halfRange : float = estimateRange * 0.5;
		var s : float[] = [ val - halfRange, val + halfRange ];
		if (s[1] > 1.0) {
			var f : float = s[1] - 1.0;
			s[0] -= f;
			s[1] -= f;
		}
		if (s[0] < 0.0) {
			f = Mathf.Abs (s[0]);
			s[0] += f;
			s[1] += f;
		}
		return Mathf.Clamp01 (Random.Range (s[0], s[1]));
	}
	
	public function GetSeverityEstimate () : float {
		return Mathf.Lerp (initialSeverityEstimate, severity, earlyWarningProgress);
	}
	
	public function GetHitProbabilityEstimate () : float {
		return Mathf.Lerp (initialHitProbabilityEstimate, hitProbability, earlyWarningProgress);
	}
	
	public function Test () {
		Debug.Log ("Duration: " + duration + "\nSeverity: " + severity + "\nHit probability: " + hitProbability);
	}
}