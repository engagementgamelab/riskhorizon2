#pragma strict

class StartScreenController extends MonoBehaviour {
	
	public var title : GameObject;
	public var subtitle : GameObject;
	public var intro : IntroText;
	public var backgroundScreenshot : GameObject;
	
	function Awake () {
		backgroundScreenshot = Instantiate (backgroundScreenshot);
		backgroundScreenshot.GetComponent (BackgroundScreenshot).Hide ();
	}
	
	public function LoadLevel (level : int) {
		//title.SetActiveRecursively (false);
		//subtitle.SetActiveRecursively (false);
		//backgroundScreenshot.GetComponent (BackgroundScreenshot).Show ();
		backgroundScreenshot.GetComponent (BackgroundScreenshot).FadeInLevel (0.5, level);
		//intro = Instantiate (intro);
		//intro.SetPosition (transform.position.x - 0.55, transform.position.y + 0.6);
	}
}