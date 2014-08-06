#pragma strict

class InsuranceOptionContainer extends MonoBehaviour {
	
	public var text : InsuranceMenuText;
	public var option : InsuranceRadioButton;
	
	private var textBox : InsuranceMenu2;
	
	function Awake () {
		text = Instantiate (text);
		text.transform.parent = transform;
		option = Instantiate (option);
		option.Create (this);
		option.transform.parent = transform;
	}
	
	function Start () {
		Messenger.instance.Listen ("start level", this);
	}
	
	// This overload is only for the original menu- don't actually use it!
	public function Create (position : Vector3, textX : float, id : int) {
		SetPosition (position, textX, position.y);
		option.myIndex = id;
	}
	
	public function Create (position : Vector3, textX : float, textY : float, id : int, _textBox : InsuranceMenu2) {
		textBox = _textBox;
		SetPosition (position, textX, textY);
		option.myIndex = id;
	}
	
	public function SetPosition (position : Vector3, textX : float, textY : float) {
		transform.position = MainCamera.SetPositionV3 (position.x, position.y, position.z, true, true);
		text.SetPosition (textX, textY);
	}
	
	public function SetText (t : String) {
		text.SetText (t);
	}
	
	public function SetDefault () {
		text.SetDefault ();
		textBox.SetOptionSelected (false);
	}
	
	public function SetSelected () {
		text.SetSelected ();
		textBox.SetOptionSelected (true);
	}
	
	public function SetCurrentPlan () {
		text.SetCurrentPlan ();
		option.SetCurrentPlan ();
	}
	
	public function SetUnselectable () {
		text.SetUnselectable ();
		option.SetUnselectable ();
	}
	
	public function FadeIn (fadeTime : float) {
		text.FadeIn (fadeTime);
		option.FadeIn (fadeTime);
	}
	
	public function FadeOut (fadeTime : float) {
		text.FadeOut (fadeTime);
		option.FadeOut (fadeTime);
	}
	
	public function Reset () {
		option.Reset ();
		text.ResetCurrentPlan ();
	}
	
	public function Cancel () {
		option.OnCancel ();
		text.OnCancel ();
	}
	
	public function Purchase (index : int) {
		option.OnPurchase (index);
	}
	
	public function _StartLevel () {
		Reset ();
	}
}