#pragma strict

public enum TabType {
	None,
	ArrowLeft,
	ArrowRight,
	Cancel,
	Purchase,
	Close
}

class GTBTabButton extends GameButton {
	
	public var tab : GTBTab;
	public var arrowLeft : Texture[] = new Texture[3];
	public var arrowRight : Texture[] = new Texture[3];
	public var cancel : Texture[] = new Texture[3];
	public var purchase : Texture[] = new Texture[3];
	public var close : Texture[] = new Texture[3];
	
	public var arrowLeftSmall : Texture[] = new Texture[3];
	public var arrowRightSmall : Texture[] = new Texture[3];
	public var cancelSmall : Texture[] = new Texture[3];
	public var purchaseSmall : Texture[] = new Texture[3];
	public var closeSmall : Texture[] = new Texture[3];
	
	private var left : boolean;
	private var textBox : GUITextBox;
	private var tabType : TabType;
	
	private var boxCollider : BoxCollider;
	
	public function Create (layer : int, _left : boolean, _tabType : TabType, _textBox : GUITextBox) {
		
		left = _left;
		textBox = _textBox;
		tabType = _tabType;
		
		if (left) {
			hotkey = KeyCode.Escape;
		} else {
			hotkey = KeyCode.Return;
		}
		
		boxCollider = gameObject.GetComponent (BoxCollider);
		
		InitGameSprite (layer, -0.2);
		transform.parent = textBox.transform;
		
		SetPosition (left);
		
		tab = Instantiate (tab);
		tab.transform.parent = textBox.transform;
		tab.Create (layer, left);
		
		SetTabType (tabType);
	}
	
	private function SetPosition (left : boolean) {
		var scale : float = MainCamera.scale;
		var position : Vector2;
		if (left) {
			position.x = -0.866 * scale;
		} else {
			position.x = 0.866 * scale;
		}
		position.y = -1.4 * scale;
		SpriteTransform.localPosition = MainCamera.SetPositionV3 (position.x, position.y, Depth, true, true);
	}
	
	private function SetButtonSprites () {
		var t : Texture[];
		if (UseSmallScreen ()) {
			switch (tabType) {
				case TabType.None : break;
				case TabType.ArrowLeft : t = arrowLeftSmall; break;
				case TabType.ArrowRight : t = arrowRightSmall; break;
				case TabType.Cancel : t = cancelSmall; break;
				case TabType.Purchase : t = purchaseSmall; break;
				case TabType.Close : t = closeSmall; break;
			}
		} else {
			switch (tabType) {
				case TabType.None : break;
				case TabType.ArrowLeft : t = arrowLeft; break;
				case TabType.ArrowRight : t = arrowRight; break;
				case TabType.Cancel : t = cancel; break;
				case TabType.Purchase : t = purchase; break;
				case TabType.Close : t = close; break;
			}
		}
		/*if (tabType == TabType.None) {
			tab.Hide ();
			Hide ();
		} else {
			tab.Show ();
			Show ();
			SetTextures (t);
		}*/
		
		if (tabType != TabType.None) {
			Show ();
			SetTextures (t);
		}
	}
	
	public function GetTabType () {
		return tabType;
	}
	
	public function SetTabType (_tabType : TabType) {
		tabType = _tabType;
		SetButtonSprites ();
		SetTexture (TextureIndex);
	}
	
	public function SetActive (activated : boolean) {
		boxCollider.enabled = activated;
		tab.gameObject.SetActiveRecursively (activated);
	}
	
	public function OnSelect () {
		textBox.OnTabButtonSelect (left);
		textBox.OnTabButtonSelect (tabType);
	}
	
	/*public function ShowTab () {
		Show ();
		tab.Show ();
	}*/
	
	public function FadeInTab (fadeTime : float) {
		tab.FadeIn (fadeTime);
		FadeIn (fadeTime);
	}
	
	public function FadeOutTab (fadeTime : float) {
		tab.FadeOut (fadeTime);
		FadeOut (fadeTime);
	}
}