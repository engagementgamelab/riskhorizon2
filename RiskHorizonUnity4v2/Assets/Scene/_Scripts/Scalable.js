#pragma strict

class Scalable extends MonoBehaviour {
	
	private var smallScreen : boolean = true;
	
	public function UseSmallScreen () : boolean {
		return smallScreen;
	}
}