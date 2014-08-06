#pragma strict

class GameText extends ZPositionedObject {

	/*private var smallScreen : boolean = true;
	public function get SmallScreen () : boolean { return smallScreen; }*/
	
	private var text : GUIText;
	
	public var smallFont : Font;
	public var smallMaterial : Material;
	
	public var outlineText : GUIText;
	public var outlineMaterial : Material;
	private var outlines : GUIText[];
	private var outline : boolean = false;
	
	public function get MyGUIText () : GUIText { return text; }
	public function get Alpha () : float { return text.material.color.a; }
	
	function Awake () {
		InitGameText (0, 0.0);
	}
	
	public function InitGameText (layer : int, depthOffset : float) {
		InitGameText (layer, depthOffset, "");
	}
	
	public function InitGameText (layer : int, depthOffset : float, t : String) {
		InitGameText (layer, depthOffset, t, false);
	}
	
	public function InitGameText (layer : int, depthOffset : float, t : String, createOutline : boolean) {
		text = GetComponent (GUIText);
		SetZPosition (layer, depthOffset);
		SetText (t);
		if (UseSmallScreen ()) {
			if (smallFont != null) SetFont (smallFont);
			if (smallMaterial != null) { SetMaterial (smallMaterial); }
		} 
		outline = createOutline;
		if (outline) CreateOutline ();
	}
	
	private function CreateOutline () {
		outlines = new GUIText[4];
		for (var i = 0; i < outlines.Length; i ++) {
			outlines[i] = Instantiate (outlineText).GetComponent (GUIText);
			outlines[i].text = text.text;
			outlines[i].font = text.font;
			outlines[i].anchor = text.anchor;
			outlines[i].material = outlineMaterial;
			outlines[i].transform.position = transform.position;
			outlines[i].transform.parent = transform;
			outlines[i].transform.position.z -= 0.1;
		}
		
		var magnitude : int = 1;
		outlines[0].pixelOffset = new Vector2 (magnitude, magnitude);
		outlines[1].pixelOffset = new Vector2 (-magnitude, -magnitude);
		outlines[2].pixelOffset = new Vector2 (magnitude, -magnitude);
		outlines[3].pixelOffset = new Vector2 (-magnitude, magnitude);
	}
	
	private function SetOutlineText () {
		if (!outline) return;
		for (var i = 0; i < outlines.Length; i ++) {
			outlines[i].text = text.text;
		}
	}
	
	public function SetAnchor (anchor : TextAnchor) {
		text.anchor = anchor;
	}
	
	public function SetFont (f : Font) {
		text.font = f;
	}
	
	public function SetText (t : String) {
		text.text = t;
		SetOutlineText ();
	}
	
	public function SetMaterial (m : Material) {
		text.material = m;
	}
	
	public function SetAlpha (a : float) {
		text.material.color.a = a;
	}
	
	public function Hide () {
		text.material.color.a = 0.0;
	}
	
	public function Show () {
		text.material.color.a = 1.0;
	}
	
	public function FadeIn (time : float) {
		CoFade (0.0, 1.0, time, false);
	}
	
	public function FadeOut (time : float) {
		FadeOut (time, false);
	}
	
	public function FadeOut (time : float, destroyOnEnd : boolean) {
		CoFade (1.0, 0.0, time, destroyOnEnd);
	}
	
	private function CoFade (from : float, to : float, time : float, destroyOnEnd : boolean) {
		
		if (text.material.color.a == to) return;
		var eTime : float = 0.0;
		
		while (eTime < time) {
			eTime += Time.deltaTime;
			var alpha = Mathf.Lerp (from, to, Mathf.SmoothStep (0.0, 1.0, eTime / time));
			text.material.color.a = alpha;
			if (outline) {
				for (var i = 0; i < outlines.Length; i ++) {
					outlines[i].material.color.a = alpha;
				}
			}
			yield;
		}
		
		OnEndFade (text.material.color.a);
		if (destroyOnEnd) gameObject.SetActive (false);
	}
	
	public function OnEndFade (alpha : float) {}
}