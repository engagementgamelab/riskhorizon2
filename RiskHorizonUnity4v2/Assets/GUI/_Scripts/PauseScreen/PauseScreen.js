#pragma strict

class PauseScreen extends MonoBehaviour {

	var leftPauseScreenAnimation : Animation;
	var rightPauseScreenAnimation : Animation;
	
	function AnimateClose () {
		leftPauseScreenAnimation.Play ("LeftClose");
		rightPauseScreenAnimation.Play ("RightClose");
	}
	
	function AnimateOpen () {
		leftPauseScreenAnimation.Play ("LeftOpen");
		rightPauseScreenAnimation.Play ("RightOpen");
	}
}