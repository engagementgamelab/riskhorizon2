#pragma strict

class GUITextBox extends Scalable {
	
	//private var smallScreen : boolean = true;
	
	// Inspector vars
	public var backgroundTexture : Texture;
	public var backgroundTextureSmall : Texture;
	
	// Prefabs to instantiate
	public var background : GTBBackground;
	public var tabButton : GTBTabButton;
	public var text : GTBText;
	public var fill : GTBFillBar;
	
	// Instances of above prefabs
	private var tabButtons : GTBTabButton[] = new GTBTabButton[2];
	private var texts : GTBText[] = new GTBText[0];
	private var fills : GTBFillBar[] = new GTBFillBar[0];
	
	// Textbox settings
	private var layer : int;
	private var position : Vector2;
	private var defaultPosition : Vector2 = new Vector2 (0.0, 0.1);
	private var myTransform : Transform;
	private var activeBox : boolean = false;
	
	private var fading : boolean = false;
	
	@System.NonSerialized
	public var LEFT : float = 0.45;
	@System.NonSerialized
	public var textPositions : Vector2[] = [
		new Vector2 (-0.55, 0.45)				// Top left
	];
	
	public function get Layer () : int { return layer; }
	public function get MyTransform () : Transform { return myTransform; }
	public function get Active () : boolean { return activeBox; }
	
	// -------------------- Creation -------------------- //
	
	function InitGTB (_layer : int) {
		InitGTB (_layer, defaultPosition);
	}
	
	function InitGTB (_layer : int, _position : Vector2) {
		layer = _layer;
		position = _position;
		myTransform = transform;
		myTransform.position = MainCamera.SetPositionV3 (position.x, position.y, 0.0, true);
	}
	
	public function CreateBackground () : GTBBackground{
		background = Instantiate (background);
		background.transform.parent = myTransform;
		if (UseSmallScreen ()) {
			background.Create (layer, backgroundTextureSmall, this);
		} else {
			background.Create (layer, backgroundTexture, this);
		}
		return background;
	}
	
	public function CreateTabs (tabLeft : TabType, tabRight : TabType) {
		var tt : TabType[] = [tabLeft, tabRight];
		CreateTabs (tt);
	}
	
	public function CreateTabs (tabs : TabType[]) : GTBTabButton[] {
		tabButtons[0] = Instantiate (tabButton);
		tabButtons[0].Create (layer, true, tabs[0], this);
		tabButtons[1] = Instantiate (tabButton);
		tabButtons[1].Create (layer, false, tabs[1], this);
		return tabButtons;
	}
	
	public function CreateText (textContent : String, position : Vector2, textSize : TextSize) : GTBText {
		return CreateText (textContent, position, textSize, TextAnchor.UpperLeft, false, false);
	}
	
	public function CreateText (textContent : String, position : Vector2, textSize : TextSize, anchor : TextAnchor, useDefaultHeight : boolean, useDefaultFont : boolean) : GTBText {
		var t : GTBText = Instantiate (text);
		t.transform.parent = myTransform;
		t.Create (layer, position, textContent, textSize, anchor, useDefaultHeight, useDefaultFont);
		texts = AppendArray (texts, t);
		return t;
	}
	
	public function CreateFillBar (position : Vector2) : GTBFillBar {
		return CreateFillBar (position, 31);
	}
	
	public function CreateFillBar (position : Vector2, spacing : float) : GTBFillBar {
		return CreateFillBar (position, spacing, true, true);
	}
	
	public function CreateFillBar (position : Vector2, spacing : float, useDefaultRatio : boolean, useDefaultHeight : boolean) : GTBFillBar {
		var fb : GTBFillBar = Instantiate (fill);
		fb.transform.parent = myTransform;
		fb.Create (layer, position, spacing, useDefaultRatio, useDefaultHeight);
		fills = AppendArray (fills, fb);
		return fb;
	}
	
	// -------------------- Activation -------------------- //
	
	public function Activate (fadeTime : float) {
		CancelInvoke ("Deactivate");
		Activate ();
		OnFadeIn (fadeTime);
		if (background != null) background.FadeIn (fadeTime);
		for (var i = 0; i < tabButtons.Length; i ++) {
			if (tabButtons[i] == null) continue;
			if (tabButtons[i].GetTabType () == TabType.None) continue;
			tabButtons[i].FadeInTab (fadeTime);
		}
		
		for (i = 0; i < texts.Length; i ++) {
			if (texts[i] == null) continue;
			texts[i].FadeIn (fadeTime);
		}
		
		/*for (i = 0; i < fills.Length; i ++) {
			if (fills[i] == null) continue;
			fills[i].FadeIn (fadeTime);
		}*/
	}
	
	public function Deactivate (fadeTime : float) {
		if (!Active) return;
		CancelInvoke ("Deactivate");
		OnFadeOut (fadeTime);
		if (background != null) background.FadeOut (fadeTime);
		for (var i = 0; i < tabButtons.Length; i ++) {
			if (tabButtons[i] == null) continue;
			if (tabButtons[i].GetTabType () == TabType.None) continue;
			tabButtons[i].FadeOutTab (fadeTime);
		}
		
		for (i = 0; i < texts.Length; i ++) {
			if (texts[i] == null) continue;
			texts[i].FadeOut (fadeTime);
		}
		
		/*for (i = 0; i < fills.Length; i ++) {
			if (fills[i] == null) continue;
			fills[i].FadeOut (fadeTime);
		}*/
		
		Invoke ("Deactivate", fadeTime);
	}
	
	public function Activate () {
		SetActive (true);
		activeBox = true; 
		OnActivate ();
	}
	
	public function Deactivate () {
		SetActive (false);
		activeBox = false;
		OnDeactivate ();
	}
	
	private function SetActive (activated : boolean) {
		
		if (background != null) {
			background.gameObject.SetActiveRecursively (activated);
			background.Show ();
		}
		
		for (var i = 0; i < tabButtons.Length; i ++) {
			if (tabButtons[i] == null) continue;
			if (tabButtons[i].GetTabType () == TabType.None) {
				tabButtons[i].SetActive (false);
				tabButtons[i].gameObject.SetActiveRecursively (false);
				continue;
			}
			if (activated) {
				tabButtons[i].gameObject.SetActiveRecursively (activated);
				tabButtons[i].SetActive (activated);
			} else {
				tabButtons[i].SetActive (activated);
				tabButtons[i].gameObject.SetActiveRecursively (activated);
			}
		}
		
		for (i = 0; i < texts.Length; i ++) {
			if (texts[i] == null) continue;
			texts[i].gameObject.SetActiveRecursively (activated);
			texts[i].Show ();
		}
		
		for (i = 0; i < fills.Length; i ++) {
			if (fills[i] == null) continue;
			if (activated) {
				fills[i].gameObject.SetActiveRecursively (activated);
			} else {
				fills[i].Deactivate ();
			}
		}
	}
	
	public function OnActivate () {}
	public function OnDeactivate () {}
	public function OnFadeIn (fadeTime : float) {}
	public function OnFadeOut (fadeTime : float) {}
	
	// -------------------- Feedback -------------------- //
	
	public function OnTabButtonSelect (left : boolean) {}
	public function OnTabButtonSelect (tabType : TabType) {}
	
	// -------------------- Set Content -------------------- //
	
	public function SetTab (left : boolean, tabType : TabType) {
		var t : GTBTabButton = (left) ? tabButtons[0] : tabButtons[1];
		t.SetTabType (tabType);
	}
	
	public function SetTabs (leftTab : TabType, rightTab : TabType) {
		if (leftTab == TabType.None && tabButtons[0].active) {
			tabButtons[0].SetActive (false);
			tabButtons[0].gameObject.SetActiveRecursively (false);
		}
		
		if (rightTab == TabType.None && tabButtons[1].active) {
			tabButtons[1].SetActive (false);
			tabButtons[1].gameObject.SetActiveRecursively (false);
		}
		
		if (leftTab != TabType.None) {
			tabButtons[0].gameObject.SetActiveRecursively (true);
			tabButtons[0].SetActive (true);
			tabButtons[0].SetTabType (leftTab);
		}
		
		if (rightTab != TabType.None) {
			tabButtons[1].gameObject.SetActiveRecursively (true);
			tabButtons[1].SetActive (true);
			tabButtons[1].SetTabType (rightTab);
		}
		
		if (leftTab == TabType.None) tabButtons[0].CancelFade (0.0);
		if (rightTab == TabType.None) tabButtons[1].CancelFade (0.0);
	}
	
	public function SetTextContent (index : int, content : String) {
		texts[index].SetText (content);
	}
	
	public function SetBackground (texture : Texture) {
		background.SetTexture (texture);
	}
	
	public function GrowBackground (time : float) {
		background.Grow (time);
	}
	
	public function ShrinkBackground (time : float) {
		background.Shrink (time);
	}
	
	public function BackgroundOnEndScale (scale : float) {}
	
	public function SetPosition (position : Vector2) {
		SetPosition (position, true);
	}
	
	public function SetPosition (position : Vector2, useDefaultRatio : boolean) {
		myTransform.position = MainCamera.SetPositionV3 (position.x, position.y, 0.0, useDefaultRatio);
	}
	
	public function SetTextPosition (index : int, position : Vector2) {
		SetTextPosition (index, position, false);
	}
	
	public function SetTextPosition (index : int, position : Vector2, useDefaultHeight : boolean) {
		var p : Vector2;
		if (useDefaultHeight) p = MainCamera.SetPositionScreenSpaceDefaultHeight (position.x, position.y);
		else p = MainCamera.SetPositionScreenSpace (position.x, position.y);
		texts[index].transform.position = p;
	}
	
	// -------------------- Get Content -------------------- //
	
	public function GetText (index : int) {
		return texts[index].GetComponent (GUIText);
	}
	
	private function AppendArray (arr : GTBText[], newVal : GTBText) : GTBText[] {
		var newLength : int = arr.Length + 1;
		var newArr : GTBText[] = new GTBText[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
	
	private function AppendArray (arr : GTBFillBar[], newVal : GTBFillBar) : GTBFillBar[] {
		var newLength : int = arr.Length + 1;
		var newArr : GTBFillBar[] = new GTBFillBar[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
}