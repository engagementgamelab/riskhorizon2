#pragma strict

class DevelopmentBar extends MonoBehaviour {
	
	public var bob : Bob;
	public var glass : DevGlass;
	public var goal : GoalLine;
	public var mercury : Mercury;
	
	public function get DevSpeed () : float { return mercury.DevSpeed; }
	
	function Start () {
		if (GameController.instance.tutorialLevel) {
			Hide ();
		}
	}
	
	private function Hide () {
		bob.Hide ();
		glass.Hide ();
		goal.Hide ();
		mercury.HideMercury ();
	}
	
	public function Show () {
		bob.FadeIn (1.0);
		glass.FadeIn (1.0);
		goal.FadeIn (1.0);
		yield WaitForSeconds (1.0);
		mercury.ShowMercury ();
	}
}