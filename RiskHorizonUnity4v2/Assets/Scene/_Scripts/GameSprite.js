#pragma strict

class GameSprite extends Scalable {
	
	/*private var smallScreen : boolean = true;
	public function get SmallScreen () : boolean { return smallScreen; }*/
	
	public var textures : Texture[];
	public var texturesSmall : Texture[] = new Texture[0];
	
	private var usedTextures : Texture[];	// Fill this array with either 'textures' or 'texturesSmall' depending on the screen size
	
	private var textureCount : int;
	private var textureIndex : int = 0;
	private var material : Material;
	private var layerOffsets : float[] = [ 
		0.0,	// Notification
		100.0, 	// Pause screen, Tutorial
		200.0, 	//
		300.0,  // Insurance menu
		400.0, 	// Development bar, menu buttons, pause
		500.0, 	// Telescope
		600.0, 	// GrowerMenu
		700.0, 	// Scaffolding, Lever
		800.0, 	// Growers
		900.0, 	// Plots
		1000.0	// Sky, Meteors, WaterBackground, WaterOverlay, LandBackground, Lift, LandFrontPiece
	];
	
	@System.NonSerialized
	public var myTransform : Transform;
	
	private var anchor : GameSpriteAnchor;
	private var anchorTransform : Transform;
	private var spriteTransform : Transform;
	
	private var fading : boolean = false;
	private var createdSprite : boolean = false;
	
	public function get TextureIndex () : int { return textureIndex; }
	public function get TextureCount () : int { return textureCount; }
	public function get Depth () : float { return SpriteTransform.position.z; }
	public function get Alpha () : float { return renderer.material.color.a; }
	public function set Alpha (value : float) { renderer.material.color.a = value; }
	public function get AnchorTransform () { return anchorTransform; }
	public function set AnchorTransform (value : Transform) { anchorTransform = value; }
	public function get SpriteTransform () { return spriteTransform; }
	public function set SpriteTransform (value : Transform) { spriteTransform = value; }
	public function get Height () { return renderer.material.GetTexture ("_MainTex").height; }
	public function get Width () { return renderer.material.GetTexture ("_MainTex").width; }
	public function get CreatedSprite () : boolean { return createdSprite; }
	
	private var defaultWidth : int = 1536; //768;
	private var defaultHeight : int = 1152; //576;
	private var targetWidth : int;
	private var targetHeight : int;
	private var resolutionScale : float = 1.0;
	
	public function get DefaultHeight () : int { return defaultHeight; }
	public function get DefaultWidth () : int { return defaultWidth; }
	public function get ResolutionScale () : float { return resolutionScale; }
	
	static var defaultDimensions : Vector2 = new Vector3 (1536.0, 1152.0); //new Vector2 (768.0, 576.0);
	
	/*function Awake () {
		InitGameSprite (0, 0.0);
	}*/
	
	public function SetDefaultDimensions (dw : int, dh : int) {
		defaultWidth = dw;
		defaultHeight = dh;
	}
	
	public function InitGameSprite (layer : int) {
		InitGameSprite (layer, 0.0);
	}
	
	public function InitGameSprite (layer : int, depthOffset : float) {
		InitGameSprite (layer, depthOffset, false);
	}
	
	public function InitGameSprite (layer : int, depthOffset : float, useY : boolean) {
		InitGameSprite (layer, depthOffset, useY, null, null);
	}
	
	public function InitGameSprite (layer : int, depthOffset : float, useY : boolean, _textures : Texture[], _texturesSmall : Texture[]) {
		
		targetWidth = MainCamera.GetTargetWidth ();
		targetHeight = MainCamera.GetTargetHeight ();
		
		ScaleToScreenSize ();
		
		// Position
		myTransform = transform;
		spriteTransform = transform;
		
		// Material
		renderer.material = new Material (Shader.Find ("Transparent/Diffuse"));
		material = renderer.material;
		
		// Texture
		if (_textures != null) textures = _textures;
		if (_texturesSmall != null) texturesSmall = _texturesSmall;
		if (UseSmallScreen ()) {
		//if (GameController.instance.smallScreen) {
			if (texturesSmall.Length == 0) {
				usedTextures = textures;
			} else {
				usedTextures = texturesSmall;
			}
		} else {
			usedTextures = textures;
		}
		textureCount = usedTextures.Length;
		SetTexture (0);
		
		// Position
		SetZPosition (layer, depthOffset, useY);
		
		createdSprite = true;
	}
	
	public function ScaleToScreenSize () {
		/*if (targetHeight == -1 || targetWidth == -1) {
			Debug.Log (gameObject);
		} else {
			while (defaultWidth > targetWidth) {
				defaultWidth *= 0.5;
				defaultHeight *= 0.5;
				resolutionScale *= 0.5;
			}
		}*/
		
		// Use this instead of the above code after all graphics have been scaled
		resolutionScale = MainCamera.scale;
		defaultWidth *= resolutionScale;
		defaultHeight *= resolutionScale;
	}
	
	public function SetTextures (_textures : Texture[]) {
		textures = _textures;
		usedTextures = textures;
	}
	
	public function SetTexture (i : int) {
		while (usedTextures == null) { yield; }
		if (i < 0 || i > usedTextures.Length - 1) return;
		SetTexture (usedTextures[i]);
		textureIndex = i;
	}
	
	public function SetTexture (t : Texture) {
		if (!SetEnabled (t)) return;
		material.SetTexture ("_MainTex", t);
		/*for (var i = 0; i < usedTextures.Length; i ++) {
			if (usedTextures[i] == t) {
				textureIndex = i;
				break;
			}
		}*/
		SetScale ();
	}
	
	public function SetScale () {
		var t : Texture = material.GetTexture ("_MainTex");
		spriteTransform.localScale = new Vector3 (-t.width * resolutionScale, t.height * resolutionScale, 1.0);
	}
	
	public function SetScale (s : float) {
		SetScale (s, true);
	}
	
	public function SetScale (s : float, useGameScale : boolean) {
		var s2 = (useGameScale) ? resolutionScale : 1.0;
		SpriteTransform.localScale = new Vector3 (-s * s2, s * s2, 1.0);
	}
	
	public function GetScale () {
		return spriteTransform.localScale.x;
	}
	
	public function SetZPosition (layer : int, depthOffset : float) {
		SetZPosition (layer, depthOffset, false);
	}
	
	public function SetZPosition (layer : int, depthOffset : float, useY : boolean) {
		var y : float = (useY) ? (spriteTransform.position.y * 0.01) : 0.0;
		spriteTransform.position.z = y + depthOffset + layerOffsets[layer];
	}
	
	public function SetZPosition (z : float) {
		spriteTransform.position.z = z;
	}
	
	public function SetAnchor (center : Vector2) {
		
		if (center == Vector2.zero) return;
		
		if (anchor == null) {
			var parent : Transform = spriteTransform.parent;
			var gameSpriteAnchor = GameObject.Find ("GameSpriteAnchor");
			anchor = GameObject.Instantiate (gameSpriteAnchor).GetComponent (GameSpriteAnchor);
			anchorTransform = anchor.Create (this);
			
			spriteTransform.parent = anchorTransform;
			if (parent != null) anchorTransform.parent = parent;
			anchorTransform.position.z = 0;
			myTransform = anchorTransform;
		}
		
		spriteTransform.localPosition.x = center.x;
		spriteTransform.localPosition.y = center.y;
	}
	
	public function SetRandomTexture () : int {
		textureIndex = Random.Range (0, textureCount);
		SetTexture (usedTextures[textureIndex]);
		return textureIndex;
	}
	
	public function DisableRenderer () {
		renderer.enabled = false;
	}
	
	public function EnableRenderer () {
		renderer.enabled = true;
	}
	
	public function FadeIn (time : float) {
		StartCoroutine (CoFade (0.0, 1.0, time));
	}
	
	public function FadeOut (time : float) {
		StartCoroutine (CoFade (1.0, 0.0, time));
	}
	
	public function CancelFade (a : float) {
		fading = false;
		Alpha = a;
	}
	
	public function Grow (time : float) {
		StartCoroutine (CoScale (0.0, 1.0, time));
	}
	
	public function Shrink (time : float) {
		if (!gameObject.activeSelf) return;
		StartCoroutine (CoScale (1.0, 0.0, time));
	}
	
	public function SetColor (c : Color) {
		renderer.material.color = c;
	}
	
	public function Hide () {
		Alpha = 0.0;
	}
	
	public function Show () {
		Alpha = 1.0;
	}
	
	public function OnEndFade (alpha : float) {}
	public function OnEndScale (scale : float) {}
	
	// -------------------- Private functions -------------------- //
	
	private function SetEnabled (t : Texture) : boolean {
		if (t == null) {
			renderer.enabled = false;
		} else {
			renderer.enabled = true;
		}
		return renderer.enabled;
	}
	
	private function CoFade (from : float, to : float, time : float) {
		
		if (renderer.material.color.a == to) return;
		fading = true;
		var eTime : float = 0.0;
		
		while (eTime < time && fading) {
			eTime += Time.deltaTime;
			Alpha = Mathf.Lerp (from, to, Mathf.SmoothStep (0.0, 1.0, eTime / time));
			yield;
		}
		fading = false;
		OnEndFade (Alpha);
	}
	
	private function CoScale (from : float, to : float, time : float) {
		while (renderer.material.GetTexture ("_MainTex") == null) { yield; }
		
		var tex : Texture = renderer.material.GetTexture ("_MainTex");
		var size : float = tex.width * resolutionScale;
		
		var eTime : float = 0.0;
		var startScale : Vector3 = new Vector3 (from * -size, from * size, 1.0);
		var endScale : Vector3 = new Vector3 (to * -size, to * size, 1.0);
		
		while (eTime < time) {
			eTime += Time.deltaTime;
			SpriteTransform.localScale = Vector3.Lerp (startScale, endScale, Mathf.SmoothStep (0.0, 1.0, eTime / time));
			yield;
		}
		
		OnEndScale (to);
	}
}