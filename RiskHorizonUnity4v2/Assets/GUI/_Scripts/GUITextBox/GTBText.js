#pragma strict

public enum TextSize {
	Large,
	Medium,
	MediumSmall,
	Small
}

class GTBText extends GameText {
	
	public var large : Font;
	public var medium : Font;
	public var mediumSmall : Font;
	public var small : Font;
	
	public var large80 : Font;
	public var medium80 : Font;
	public var mediumSmall80 : Font;
	public var small80 : Font;
	
	function Create (layer : int, position : Vector2, content : String, textSize : TextSize, anchor : TextAnchor, useDefaultHeight : boolean, useDefaultFont : boolean) {
		InitGameText (layer, 0.0, content);
		if (useDefaultHeight) {
			transform.position = MainCamera.SetPositionScreenSpaceDefaultHeight (position.x, position.y);
		} else {
			transform.position = MainCamera.SetPositionScreenSpace (position.x, position.y);
		}
		
		SetTextSize (textSize, useDefaultFont);
		SetAnchor (anchor);
	}
	
	private function SetTextSize (textSize : TextSize, useDefaultFont : boolean) {
		var f : Font = small;
		/*if (UseSmallScreen ()) {
			switch (textSize) {
				case TextSize.Large : f = large80; break;
				case TextSize.Medium : f = medium80; break;
				case TextSize.MediumSmall : f = mediumSmall80; break;
				case TextSize.Small : f = small80; break;
			}
		} else {
			switch (textSize) {
				case TextSize.Large : f = large; break;
				case TextSize.Medium : f = medium; break;
				case TextSize.MediumSmall : f = mediumSmall; break;
				case TextSize.Small : f = small; break;
			}
		}*/
		var fc : FontContainer = FontContainer.instance;
		if (useDefaultFont) {
			switch (textSize) {
				case TextSize.Large : f = fc.GetDefaultLarge (); break;
				case TextSize.Medium : f = fc.GetDefaultMedium (); break;
				case TextSize.MediumSmall : f = fc.GetDefaultMediumSmall (); break;
				case TextSize.Small : f = fc.GetDefaultSmall (); break;
			}
		} else {
			switch (textSize) {
				case TextSize.Large : f = fc.GetLarge (); break;
				case TextSize.Medium : f = fc.GetMedium (); break;
				case TextSize.MediumSmall : f = fc.GetMediumSmall (); break;
				case TextSize.Small : f = fc.GetSmall (); break;
			}
		}
		SetFont (f);
	}
	
	public function SetPosition (position : Vector2) {
		transform.position = MainCamera.SetPositionScreenSpace (position.x, position.y);
	}
}