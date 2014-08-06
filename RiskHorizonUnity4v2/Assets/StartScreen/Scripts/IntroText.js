#pragma strict

class IntroText extends MonoBehaviour {
	
	private var text : String = "Can you create a flourishing community by balancing risk management and healthy development?\n\nAs the new Alorian Luminator, your job is to reach development goals before the end of each round. Do this by building and upgrading Alorian pods, increasing the rate at which your development increases.";
	private var lineLength : float;
	
	function Start () {
		lineLength = MainCamera.GetHeight () * 1.52;
		text = WrapString (text, guiText);
		guiText.text = text;
		//LoadLevel ();
	}
	
	/*public function LoadLevel () {
		yield WaitForFixedUpdate ();
		Application.LoadLevel (1);
	}*/
	
	public function SetPosition (x : float, y : float) {
		transform.position = MainCamera.SetPositionScreenSpace (x, y);
	}
	
	private function WrapString (text : String, gText : GUIText) : String {
	 		
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