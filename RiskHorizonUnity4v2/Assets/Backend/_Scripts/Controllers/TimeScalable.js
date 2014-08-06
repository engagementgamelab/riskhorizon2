#pragma strict

// Any object that is affected when the time scale is changed should extend this class
// Make sure to call InitTimeScalable() in the Start function

class TimeScalable extends Scalable {
	
	@System.NonSerialized
	public var timeScale : float = 1.0;
	
	function InitTimeScalable () {
		UpdateTimeScale ();
		Messenger.instance.Listen ("time scale set", this);
	}
	
	function _TimeScaleSet () {
		UpdateTimeScale ();
		OnSetTimeScale (timeScale);
	}
	
	function OnSetTimeScale (ts : float) {
	
	}
	
	function UpdateTimeScale () {
		timeScale = TimeController.timeScale;
	}
	
	// Use this instead of Invoke ()
	function TSInvoke (fn : String, time : float) {
		StartCoroutine (CoInvoke (fn, time));
	}
	
	private function CoInvoke (fn : String, time : float) {
		var eTime : float = 0.0;
		while (eTime < time) {
			if (GameState.TimePassing () && !GameState.CheckState (State.Tutorial)) {
				eTime += Time.deltaTime * timeScale;
			}
			yield;
		}
		SendMessage (fn, SendMessageOptions.DontRequireReceiver);
	}
}