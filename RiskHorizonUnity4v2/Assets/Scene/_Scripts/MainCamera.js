#pragma strict

class MainCamera extends MonoBehaviour {
	
	class ScreenResolution extends System.Object {
		
		private var maxWidth : int = 2048;			// Maximum width of game (iPad Retina)
		private var maxHeight : int = 1536;			// Maximum height of game (iPad Retina)
		private var targetWidth : int = 960;		// Width of the device we're on
		private var targetHeight : int = 640;		// Height of the device we're on
		private var camHeight : int = 288;			// Camera size (half screen height)
		private var defaultCamHeight : int = 288;	// Camera size that the sprites were designed for
		private var defaultRatio : float = 0.0;		// Aspect ratio the game was designed for (4:3)
		private var aspectRatio : float = 0.0;		// Aspect ratio of the device we're on
		
		public function get CamHeight () : int { return camHeight; }
		public function get DefaultCamHeight () : int { return defaultCamHeight; }
		public function get TargetWidth () : int { return targetWidth; }
		public function get TargetHeight () : int { return targetHeight; }
		public function get DefaultRatio () : float { return defaultRatio; }
		public function get ARatio () : float { return aspectRatio; }
		
		function ScreenResolution (w : float, h : float) {
			targetWidth = w;
			targetHeight = h;
			camHeight = targetHeight * 0.5;
			defaultRatio = (maxWidth + 0.0) / (maxHeight + 0.0);
			aspectRatio = (targetWidth + 0.0) / (targetHeight + 0.0);
		}
	}	
		
	// 960x720 = 360
	// 768x576 = 288
	//static var height : int = 288;
	static var top : float;
	static var bottom : float;
	static var left : float;
	static var right : float;
	static var cam : Camera;
	static var horizon : float;
	static var horizonScreenSpace : float;
	static var mouseOverLand : boolean = false;
	
	static var res : ScreenResolution;
	static var scale : float = 1.0;
	
	private var landLayerMask : int = 1 << 8;
	
	public var fontContainer : FontContainer;
	
	function Awake () {
		res = new ScreenResolution (Screen.width, Screen.height);
		fontContainer.OnSetScreenSize ();
		cam = GetComponent (Camera);
		cam.orthographicSize = res.CamHeight; //Screen.height / 2;
		//camera.aspect = Screen.currentResolution.width / Screen.currentResolution.height;
		//height = cam.orthographicSize;
		
		top = 1.0;
		bottom = -1.0;
		left = -1.0;
		right = 1.0;
		
		var h2 : float = res.TargetHeight; //height * 2;
		horizonScreenSpace = top - 0.25;
		horizon = h2 - (h2 * 0.25);
		
		var defaultWidth : float = 1601.0;//801.0;//768.0;
		while (defaultWidth * scale > res.TargetWidth) {
			scale *= 0.5;
		}
	}
	
	static function GetTargetWidth () : int {
		if (MainCamera.res == null) return -1;
		return MainCamera.res.TargetWidth;
	}
	
	static function GetTargetHeight () : int {
		if (MainCamera.res == null) return -1;
		return MainCamera.res.TargetHeight;
	}
	
	static function GetHeight () : int {
		if (MainCamera.res == null) {
			//Debug.Log ("can't get height");
			return -1;
		}
		return MainCamera.res.CamHeight;
	}
	
	static function GetDefaultHeight () : int {
		if (MainCamera.res == null) {
			return -1;
		}
		return MainCamera.res.DefaultCamHeight;
	}
	
	static function GetRatio () : float {
		return MainCamera.res.ARatio;
	}
	
	static function GetDefaultRatio () : float {
		if (MainCamera.res == null) {
			//Debug.Log ("can't get default ratio");
			return -1;
		}
		return MainCamera.res.DefaultRatio;
	}
	
	function Update () {
		mouseOverLand = Physics.Raycast (
			cam.ScreenToWorldPoint (Input.mousePosition), 
			Vector3.forward, 
			1100, 
			landLayerMask
		);
	}
	
	static function GetPosition (position : Vector3) : Vector3 {
		var normalized : Vector3;
		normalized.x = ((position.x / (Screen.width + 0.0)) * 2.0) - 1.0;
		normalized.y = ((position.y / (Screen.height + 0.0)) * 2.0) - 1.0;
		normalized.z = position.z;
		return normalized;
	}
	
	static function SetPosition (x : float, y : float, useDefaultRatio : boolean) : Vector2 {
		x = MainCamera.MapWidth (x, useDefaultRatio);
		return new Vector2 (MainCamera.GetHeight () * x, MainCamera.GetHeight () * y);
	}
	
	static function SetPositionV3 (x : float, y : float, useDefaultRatio : boolean) : Vector3 {
		x = MainCamera.MapWidth (x, useDefaultRatio);
		return new Vector3 (MainCamera.GetHeight () * x, MainCamera.GetHeight () * y, 0.0);
	}
	
	static function SetPositionV3 (x : float, y : float, myZ : float, useDefaultRatio : boolean) : Vector3 {
		x = MainCamera.MapWidth (x, useDefaultRatio);
		return new Vector3 (MainCamera.GetHeight () * x, MainCamera.GetHeight () * y, myZ);
	}
	
	static function SetPositionV3 (x : float, y : float, myZ : float, useDefaultRatio : boolean, useDefaultHeight : boolean) : Vector3 {
		x = MainCamera.MapWidth (x, useDefaultRatio);
		var h : float = (useDefaultHeight) ? MainCamera.GetDefaultHeight () : MainCamera.GetHeight ();
		return new Vector3 (h * x, h * y, myZ);
	}
	
	static function SetPositionScreenSpace (x : float, y : float) : Vector2 {
		x = MainCamera.Map (x, -1.0, 1.0, 0.0, 1.0);
		y = MainCamera.Map (y, -1.0, 1.0, 0.0, 1.0);
		return new Vector2 (x, y);
	}
	
	static function SetPositionScreenSpaceDefaultHeight (x : float, y : float) : Vector2 {
		var x2 : float = (GameSprite.defaultDimensions.x + 0.0) / (MainCamera.GetTargetWidth () + 0.0);
		var y2 : float = (GameSprite.defaultDimensions.y + 0.0) / (MainCamera.GetTargetHeight () + 0.0);
		x2 = (1.0 - x2) * 0.5;
		y2 = (1.0 - y2) * 0.5;
		
		x = MainCamera.Map (x, -1.0, 1.0, 0.0 + x2, 1.0 - x2);
		y = MainCamera.Map (y, -1.0, 1.0, 0.0 + y2, 1.0 - y2);
		
		return new Vector2 (x, y);
	}
	
	static function SetPositionScreenSpaceV3 (x : float, y : float) : Vector3 {
		var v2 : Vector2 = MainCamera.SetPositionScreenSpace (x, y);
		return new Vector3 (v2.x, v2.y, 0.0);
	}
	
	static function AnchorLowerRight (spriteLength : int, spriteHeight : int, myZ : float) {
		var x : float = MainCamera.GetRatio () * MainCamera.GetHeight () - ((spriteLength + 0.0) * 0.5);
		var y : float = -MainCamera.GetHeight () + ((spriteHeight + 0.0) * 0.5);
		return new Vector3 (x, y, myZ);
	}
	
	static function WorldToScreenY (val : float) : float {
		var h : float = MainCamera.GetHeight ();
		return MainCamera.Map (val, -h, h, -1.0, 1.0);
	}
	
	static function WorldToScreenX (val : float) : float {
		var w : float = MainCamera.GetTargetWidth () * 0.5;
		return MainCamera.Map (val, -w, w, -1.0, 1.0);
	}
	
	static function ScreenToMyScreenX (val : float) : float {
		return MainCamera.Map (val, 0.0, 1.0, -1.0, 1.0);
	}
	
	static function ScreenToMyScreenY (val : float) : float {
		return MainCamera.Map (val, 0.0, 1.0, -1.0, 1.0);
	}
	
	static function Map (val : float, from1 : float, to1 : float, from2 : float, to2 : float) : float {
		return (val - from1) / (to1 - from1) * (to2 - from2) + from2;
	}
	
	static function MapWidth (val : float, useDefault : boolean) : float {
		var w : float = (useDefault) ? MainCamera.GetDefaultRatio () : MainCamera.GetRatio ();
		return MainCamera.Map (val, -1.0, 1.0, -w, w);
	}
}