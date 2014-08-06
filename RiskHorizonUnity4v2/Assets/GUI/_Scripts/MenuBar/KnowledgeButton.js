#pragma strict

class KnowledgeButton extends MenuBarButton{
	
	function OnSelect () {
		GameController.instance.OpenKnowledge ();
	}
	
	function OnUnselect () {
		GameController.instance.CloseKnowledge ();
	}
	
	function OnStateChanged () {
		if (GameState.CheckPreviousState (State.Knowledge)) {
			Unselect (false);
		}
	}
}