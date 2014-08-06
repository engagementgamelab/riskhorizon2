#pragma strict

class InsuranceMenu2 extends GUITextBox {
	
	public var optionContainer : InsuranceOptionContainer;
	
	private var optionContainers : InsuranceOptionContainer[];
	private var description : String = "If your pods are damaged, these insurance plans will cover part of the repair costs and replace part of your lost development.";//"If your pods are damaged, these insurance\nplans will cover part of the repair costs\nand replace part of your lost development.";
	
	private var resetOnOpen : boolean = false;
	
	function Awake () {
		//InitGTB (3);
	}
	
	function Start () {
		InitGTB (3, new Vector2 (0.0, 0.1));
		var scale : float = MainCamera.scale;
		var t : Vector2 = new Vector2 (-0.575, 0.55);
		t.x *= scale;
		t.y *= scale;
		CreateBackground ();
		CreateTabs (TabType.Cancel, TabType.Purchase);
		CreateText (description, t, TextSize.Medium, TextAnchor.UpperLeft, true, false);
		var lineLength : int = MainCamera.GetDefaultHeight () * 2.0 * scale * 1.6;
		SetTextContent (0, WrapString (description, GetText (0), lineLength));
		CreateContainers ();
		Deactivate ();
		Messenger.instance.Listen ("state changed", this);
		Messenger.instance.Listen ("start level", this);
	}
	
	private function CreateContainers () {
		var scale : float = MainCamera.scale;
		optionContainers = new InsuranceOptionContainer[3];
		var buttonX : float = 0.4 * scale;
		var textX : float = -0.575 * scale;
		for (var i = 0; i < 3; i ++) {
			var y : float = (0.25 - (i * 0.35)) * scale;
			var textY : float = (0.133 - (i * 0.195)) * scale;
			optionContainers[i] = Instantiate (optionContainer);
			optionContainers[i].transform.parent = MyTransform;
			optionContainers[i].Create (new Vector3 (buttonX, y, MyTransform.position.z), textX, textY, i, this);
		}
	}
	
	private function SetTextContent () {
		
		InsuranceMenuButton.selectedIndex = -1;
		InsuranceMenuButton.currentPlanButton = null;
		
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
	
	public function SetOptionSelected (selected : boolean) {
		/*if (selected) {
			SetTab (false, TabType.Purchase);
		} else {
			SetTab (false, TabType.Cancel);
		}*/
	}
	
	private function SetActiveContainers (activated : boolean) {
		for (var i = 0; i < optionContainers.Length; i ++) {
			optionContainers[i].gameObject.SetActiveRecursively (activated);
		}
	}
	
	private function ResetContainers () {
		for (var i = 0; i < optionContainers.Length; i ++) {
			optionContainers[i].Reset ();
		}
	}
	
	public function OnFadeIn (fadeTime : float) {
		for (var i = 0; i < optionContainers.Length; i ++) {
			optionContainers[i].FadeIn (fadeTime);
		}
	}
	
	public function OnFadeOut (fadeTime : float) {
		for (var i = 0; i < optionContainers.Length; i ++) {
			optionContainers[i].FadeOut (fadeTime);
		}
	}
	
	public function OnActivate () {
		SetActiveContainers (true);
		if (resetOnOpen) {
			ResetContainers ();
			resetOnOpen = false;
		}
		SetTextContent ();
	}
	
	public function OnDeactivate () {
		SetActiveContainers (false);
	}
	
	public function OnTabButtonSelect (left : boolean) {
		if (left) {
			// Cancel
			for (var i = 0; i < optionContainers.Length; i ++) {
				optionContainers[i].Cancel ();
			}
			GameController.instance.CloseInsurance ();
		} else {
			// Purchase
			var p : int = InsuranceMenuButton.selectedIndex;
			if (p == -1) return;
			GameController.instance.PurchaseInsurance (p);
			for (i = 0; i < optionContainers.Length; i ++) {
				optionContainers[i].Purchase (p);
			}
			GameController.instance.CloseInsurance ();
		}
		
		InsuranceMenuButton.selectedIndex = -1;
		InsuranceMenuButton.currentPlanButton = null;
	}
	
	function _StateChanged () {
		if (GameState.CheckState (State.Insurance)) {
			Activate ();
		}
		if (GameState.CheckPreviousState (State.Insurance)) {
			Deactivate ();
		}
	}
	
	function _StartLevel () {
		resetOnOpen = true;
	}
	
	private function WrapString (text : String, gText : GUIText, lineLength : float) : String {
	 		
 		gText.text = "";
 		
		var words : String[] = Split (text); //Split the string into seperate words
	    var result : String = "";
	 	var textSize : Rect = gText.GetScreenRect ();
		var numberOfLines = 1;
	 	
		for (var i = 0; i < words.length; i ++) {
	 
			var word = words[i];
			if (i == 0) {
				result = words[0];
				gText.text = result;
			}
			
			if (i > 0 ) {
				result += word;
				gText.text = result;
			}
 
			textSize = gText.GetScreenRect();
			if (textSize.width > lineLength) {
				
				result = result.Substring (0, result.Length - (word.Length));
				result += "\n" + word;
				numberOfLines += 1;
				gText.text = result;
			}
	    }
	    
	    return gText.text;
	}
	
	private function Split (t : String) : String[] {
		var ta : char[] = t.ToCharArray ();
		var output : String[] = new String[1];
		output[0] = ta[0].ToString ();
		for (var i = 1; i < ta.Length; i ++) {
			if (ta[i] == " ") {
				output = AppendArray (output, " ");
				continue;
			}
			output[output.Length - 1] += ta[i].ToString ();
		}
		return output;
	}
	
	private function AppendArray (arr : String[], newVal : String) : String[] {
		var newLength : int = arr.Length + 1;
		var newArr : String[] = new String[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
}