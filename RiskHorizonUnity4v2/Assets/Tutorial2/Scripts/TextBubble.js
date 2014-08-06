#pragma strict

class TextBubble extends GUITextBox {
	
	public var next : BubbleNext;
	public var bubbles : Texture[];
	private var contentPositions : Vector2[] = [
		new Vector2 (0.0, 0.05),
		new Vector2 (0.0, 0.1),
		new Vector2 (0.0, 0.133),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.15),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.075),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.1), // 14
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, -0.2),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, -0.16),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.05, 0.0), // 27
		new Vector2 (-0.05, 0.0),
		new Vector2 (0.0, 0.1),
		new Vector2 (0.0, 0.1)
	];
	
	private var lineLengths : float[] = [
		150.0,
		180.0,
		180.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		200.0,
		250.0,
		200.0,
		200.0,
		250.0,
		250.0,
		180.0,
		250.0
	];
	
	private var nextPositions : Vector2[] = [
		new Vector2 (0.0, 0.05),
		new Vector2 (0.0, 0.1),
		new Vector2 (80.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (80.0, 0.0), // 8
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (82.0, -24.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (84.0, -26.0), // 14
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, -0.2),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, -0.175),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (136.0, -52.0), // 27
		new Vector2 (106.0, -50.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (124.0, -22)
	];
	
	private var tutController : TutorialController2;
	private var gtbText : GTBText;
	private var showNext : boolean = false;
	
	public var scalePosition : Vector2;
	
	private var content : String;
	
	function Awake () {
		InitGTB (1);
	}
	
	function Start () {
		CreateBackground ();
		gtbText = CreateText ("", new Vector2 (0.0, 0.0), TextSize.MediumSmall, TextAnchor.MiddleCenter, false, false);
		next = Instantiate (next);
		next.transform.parent = transform;
		next.Create (this);
		Deactivate ();
		
		var scale : float = MainCamera.scale;
		for (var i = 0; i < nextPositions.Length; i ++) {
			nextPositions[i].x *= scale;
			nextPositions[i].y *= scale;
		}
		
		for (i = 0; i < lineLengths.Length; i ++) {
			lineLengths[i] *= scale;
		}
	}
	
	public function Create (_tutController : TutorialController2) {
		tutController = _tutController;
	}
	
	public function OnActivate () {
		//if (showNext) next.gameObject.SetActiveRecursively (true);
	}
	
	public function OnDeactivate () {
		next.gameObject.SetActive (false);
	}
	
	public function ShowBubble (_content : String, tposition : Vector2, bg : int, _showNext : boolean) {
		showNext = _showNext;
		Activate ();
		SetBackground (bubbles[bg]);
		background.Grow (0.5);
		
		content = WrapString (_content, gtbText.MyGUIText, lineLengths[bg]);
		SetTextContent (0, "");
		SetPosition (tposition, false);
		
		var cposition : Vector2 = tposition;
		cposition.x += contentPositions[bg].x;
		cposition.y += contentPositions[bg].y;
		SetTextPosition (0, cposition, false);
		
		if (showNext) {
			/*var nposition : Vector2 = tposition;
			nposition.x += nextPositions[bg].x;
			nposition.y += nextPositions[bg].y;*/
			next.transform.localPosition = new Vector3 (nextPositions[bg].x, nextPositions[bg].y, 0.0);//MainCamera.SetPositionV3 (nextPositions[bg].x, nextPositions[bg].y, 0.0, true);
		}
		
		Invoke ("ShowContent", 0.5);
	}
	
	public function ShowContent () {
		SetTextContent (0, content);
		if (showNext) next.gameObject.SetActive (true);
	}
	
	public function CloseBubble () {
		Deactivate ();
	}
	
	public function Close () {
		tutController.CloseText ();
	}
	
	private function WrapString (_text : String, gText : GUIText, _lineLength : float) : String {
	 		
		gText.text = "";
		
		var words : String[] = Split (_text); //Split the string into seperate words
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
			if (textSize.width > _lineLength) {
				
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
	
	function Update () {
		var p : Vector3 = MainCamera.cam.WorldToViewportPoint (transform.position);
		scalePosition = new Vector2 (
			Map (p.x, 0.0, 1.0, -1.0, 1.0),
			Map (p.y, 0.0, 1.0, -1.0, 1.0)
		);
	}
	
	private function Map (val : float, from1 : float, to1 : float, from2 : float, to2 : float) : float {
		return (val - from1) / (to1 - from1) * (to2 - from2) + from2;
	}
	
	public function GetBubbleWidth (index : int) : int {
		return bubbles[index].width;
	}
	
	public function GetBubbleHeight (index : int) : int {
		return bubbles[index].height;
	}
}