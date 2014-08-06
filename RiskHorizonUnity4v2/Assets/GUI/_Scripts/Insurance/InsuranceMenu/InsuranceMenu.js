#pragma strict

class InsuranceMenu extends MonoBehaviour {
	
	public var purchase : GameObject;
	public var optionContainer : InsuranceOptionContainer;
	public var optionContainers : InsuranceOptionContainer[];
	
	public var optionButtons : InsuranceRadioButton[];
	public var text : InsuranceMenuText[];
	public var descriptionText : GameObject;
	public var pauseScreen : PauseScreen;
	private var usePauseScreen : boolean = false;
	private var myTransform : Transform;
	
	function Awake () {
		myTransform = transform;
		//SetOptionPositions ();
		CreateContainers ();
	}
	
	function Start () {
		Messenger.instance.Listen ("state changed", this);
		//SetContainerPositions ();
		myTransform.position.y = MainCamera.GetHeight () * 2;
	}
	
	private function CreateContainers () {
		optionContainers = new InsuranceOptionContainer[3];
		for (var i = 0; i < 3; i ++) {
			var y : float = 0.05 - (i * 0.125);
			optionContainers[i] = Instantiate (optionContainer);
			optionContainers[i].transform.parent = myTransform;
			//optionContainers[i].Create (new Vector3 (0.45, y, myTransform.position.z), -0.55);
		}
	}
	
	/*private function SetContainerPositions () {
		for (var i = 0; i < optionContainers.Length; i ++) {
			var y : float = 0.25 - (i * 0.15);
			//optionContainers[i].transform.position = MainCamera.SetPositionV3 (0.45, y, myTransform.position.z);
			optionContainers[i].SetPosition (0.45, y, myTransform.position.z);
		}
	}*/
	
	/*private function SetOptionPositions () {
		for (var i = 0; i < optionButtons.Length; i ++) {
			var y : float = 0.25 - (i * 0.15);
			optionButtons[i].transform.position = MainCamera.SetPositionV3 (0.45, y, myTransform.position.z);
			text[i].transform.position = MainCamera.SetPositionScreenSpace (-0.55, y);
		}
	}*/
	
	private function SetTextContent () {
		
		var premiums : int[] = GameController.instance.GetInsurancePremiums ();
		var coverages : float[] = GameController.instance.GetInsuranceCoverages ();
		var plan : int = GameController.instance.GetInsurancePlan ();
		
		for (var i = 0; i < premiums.Length; i ++) {
			var p : int = Mathf.RoundToInt (coverages[i] * 100.0);
			var text : String = p.ToString () + "% coverage for $" + premiums[i].ToString ();
			optionContainers[i].SetText (text);
			if (plan == i) {
				optionContainers[i].SetCurrentPlan ();
			} else {
				if (i < plan) {
					optionContainers[i].SetUnselectable ();
				} else {
					optionContainers[i].SetDefault ();
				}
			}
		}
	}
	
	function Activate () {
		SetTextContent ();
		descriptionText.SetActiveRecursively (true);
		purchase.SetActiveRecursively (true);
		if (usePauseScreen) {
			pauseScreen.AnimateClose ();
		} else {
			myTransform.position.y = 0.0;
		}
	}
	
	function Deactivate () {
		descriptionText.SetActiveRecursively (false);
		purchase.SetActiveRecursively (false);
		if (usePauseScreen) {
			pauseScreen.AnimateOpen ();
		} else {
			myTransform.position.y = MainCamera.GetHeight () * 2;
		}
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.Insurance)) {
			Activate ();
		}
		if (GameState.CheckPreviousState (State.Insurance) && !GameState.CheckState (State.Tutorial)) {
			Deactivate ();
		}
	}
}