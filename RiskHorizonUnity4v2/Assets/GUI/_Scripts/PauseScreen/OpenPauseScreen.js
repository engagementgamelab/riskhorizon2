#pragma strict

class OpenPauseScreen extends GameSprite{

	var pauseScreen : PauseScreen;
	
	public var test : float;
	
	function Start(){
		InitGameSprite(0,-.1);
	}
	
	function OnMouseDown(){
		pauseScreen.AnimateOpen();
	}
}





