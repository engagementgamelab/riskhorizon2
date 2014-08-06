#pragma strict

public enum State {
	Development,
	Knowledge,
	Protection,
	Insurance,
	EarlyWarning,
	//Paused,
	BetweenLevels,
	Tutorial
}

static class GameState extends System.Object {
	
	public var state : State;
	public var previousState : State;
	private var defaultState : State = State.Development;
	
	// Priority states can only be switched out of by setting the state to default
	private var priorities : State[] = [ 
		State.EarlyWarning, 
		State.BetweenLevels, 
		State.Insurance
	];
	
	public function IsDefault () : boolean {
		return CheckState (defaultState);
	}
	
	public function SetStateDefault () {
		SetState (defaultState);
	}
	
	public function SetStatePrevious () {
		SetState (previousState);
	}
	
	public function SetState (s : State) : boolean {
		if (IsPriority () && s != defaultState && s != State.Tutorial) return false;
		previousState = state;
		state = s;
		Messenger.instance.Send ("state changed");
		return true;
	}
	
	public function ToggleState (s : State) {
		if (state == s) {
			SetStateDefault ();
		} else {
			SetState (s);
		}
	}
	
	public function CheckState (s : State) : boolean {
		return (state == s);
	}
	
	public function CheckPreviousState (s : State) : boolean {
		return (previousState == s);
	}
	
	public function TimePassing () : boolean {
		return !IsPriority ();
	}
	
	private function IsPriority () : boolean {
		for (var i = 0; i < priorities.Length; i ++) {
			if (state == priorities[i]) return true;
		}
		return false;
	}
}