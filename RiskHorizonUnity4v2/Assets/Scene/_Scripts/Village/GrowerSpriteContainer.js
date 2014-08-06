#pragma strict

class GrowerSpriteContainer extends Scalable {
	
	public var g0 : Texture[];
	public var g0broken : Texture[];
	public var g1 : Texture[];
	public var g1broken : Texture[];
	public var g2 : Texture[];
	public var g2broken : Texture[];
	public var g3 : Texture[];
	public var g3broken : Texture[];
	public var g4 : Texture[];
	public var g4broken : Texture[];
	public var g5 : Texture[];
	public var g5broken : Texture[];
	public var g6 : Texture[];
	public var g6broken : Texture[];
	public var g7 : Texture[];
	public var g7broken : Texture[];
	public var g8 : Texture[];
	public var g8broken : Texture[];
	
	public var g0Sm : Texture[];
	public var g0brokenSm : Texture[];
	public var g1Sm : Texture[];
	public var g1brokenSm : Texture[];
	public var g2Sm : Texture[];
	public var g2brokenSm : Texture[];
	public var g3Sm : Texture[];
	public var g3brokenSm : Texture[];
	public var g4Sm : Texture[];
	public var g4brokenSm : Texture[];
	public var g5Sm : Texture[];
	public var g5brokenSm : Texture[];
	public var g6Sm : Texture[];
	public var g6brokenSm : Texture[];
	public var g7Sm : Texture[];
	public var g7brokenSm : Texture[];
	public var g8Sm : Texture[];
	public var g8brokenSm : Texture[];
	
	private var anchorPositions : Vector2[] = [
		new Vector2 (12.0, -3.0),//new Vector2 (5.0, -3.0),
		new Vector2 (2.0, -1.0),//new Vector2 (2.0, -1.0),
		new Vector2 (-8.0, 40.0),//new Vector2 (-5.0, 21.0),
		new Vector2 (-52.0, 40.0),//new Vector2 (-24.0, 21.0),
		new Vector2 (16.0, 1.0),//new Vector2 (10.0, 1.0),
		new Vector2 (0.0, 2.0),
		new Vector2 (-2.0, 60.0),//new Vector2 (-2.0, 32.0),
		new Vector2 (28.0, 0.0),//new Vector2 (12.0, 0.0),
		new Vector2 (8.0, 0.0)//new Vector2 (2.0, 0.0)
	];
	
	static public var instance : GrowerSpriteContainer;
	
	function Awake () {
		if (instance == null) instance = this;
	}
	
	function Start () {
		for (var i = 0; i < anchorPositions.Length; i ++) {
			anchorPositions[i].x *= MainCamera.scale;
			anchorPositions[i].y *= MainCamera.scale;
		}
	}
	
	public function HasArray (index : int) : boolean {
		var length : int = 0;
		if (UseSmallScreen ()) {
			switch (index) {
				case 0 : length = g0Sm.Length; break;
				case 1 : length = g1Sm.Length; break;
				case 2 : length = g2Sm.Length; break;
				case 3 : length = g3Sm.Length; break;
				case 4 : length = g4Sm.Length; break;
				case 5 : length = g5Sm.Length; break;
				case 6 : length = g6Sm.Length; break;
				case 7 : length = g7Sm.Length; break;
				case 8 : length = g8Sm.Length; break;
			}
		} else {
			switch (index) {
				case 0 : length = g0.Length; break;
				case 1 : length = g1.Length; break;
				case 2 : length = g2.Length; break;
				case 3 : length = g3.Length; break;
				case 4 : length = g4.Length; break;
				case 5 : length = g5.Length; break;
				case 6 : length = g6.Length; break;
				case 7 : length = g7.Length; break;
				case 8 : length = g8.Length; break;
			}
		}
		return (length > 0);
	}
	
	public function GetGrowerArray (index : int) : Texture[] {
		if (UseSmallScreen ()) {
			switch (index) {
				case 0 : return g0Sm;
				case 1 : return g1Sm;
				case 2 : return g2Sm;
				case 3 : return g3Sm;
				case 4 : return g4Sm;
				case 5 : return g5Sm;
				case 6 : return g6Sm;
				case 7 : return g7Sm;
				case 8 : return g8Sm;
			}
		} else {
			switch (index) {
				case 0 : return g0;
				case 1 : return g1;
				case 2 : return g2;
				case 3 : return g3;
				case 4 : return g4;
				case 5 : return g5;
				case 6 : return g6;
				case 7 : return g7;
				case 8 : return g8;
			}
		}
		return null;
	}
	
	public function GetGrowerBrokenArray (index : int) : Texture[] {
		if (UseSmallScreen ()) {
			switch (index) {
				case 0 : return g0brokenSm;
				case 1 : return g1brokenSm;
				case 2 : return g2brokenSm;
				case 3 : return g3brokenSm;
				case 4 : return g4brokenSm;
				case 5 : return g5brokenSm;
				case 6 : return g6brokenSm;
				case 7 : return g7brokenSm;
				case 8 : return g8brokenSm;
			}
		} else {
			switch (index) {
				case 0 : return g0broken;
				case 1 : return g1broken;
				case 2 : return g2broken;
				case 3 : return g3broken;
				case 4 : return g4broken;
				case 5 : return g5broken;
				case 6 : return g6broken;
				case 7 : return g7broken;
				case 8 : return g8broken;
			}
		}
		return null;
	}

	public function GetColliderCenter (index : int) : Vector3 {
		switch (index) {
			case 0 : return new Vector3 (-0.075, -0.04, 0.0);
			case 1 : return new Vector3 (-0.075, 0.11, 0.0);
			case 2 : return new Vector3 (-0.260, 0.08, 0.0);
			case 3 : return new Vector3 (-0.360, -0.04, 0.0);
			case 4 : return new Vector3 (-0.260, -0.16, 0.0);
			case 5 : return new Vector3 (-0.075, -0.21, 0.0);
			case 6 : return new Vector3 (0.12, -0.16, 0.0);
			case 7 : return new Vector3 (0.2, -0.04, 0.0);
			case 8 : return new Vector3 (0.09, 0.08, 0.0);
		}
		return new Vector3 (0.0, 0.0, 0.0);
	}
	
	public function GetColliderSize (scale : float) : Vector3 {
		var ms : float = MainCamera.scale;
		scale = Mathf.Abs (scale);
		var xy : float = 0.0;
		if (scale < 512) {
			// 128x128
			xy = ms;
			return new Vector3 (xy, xy, 1.0);
		} else if (scale < 1024) {
			// 256x256
			xy = 0.45 * ms;
			return new Vector3 (xy, xy, 1.0);
		} else if (scale < 2048) {
			// 512x512
			xy = 0.225 * ms;
			return new Vector3 (xy, xy, 1.0);
		}
	}
	
	public function GetAnchorPosition (index : int) : Vector2 {
		//if (!UseSmallScreen ()) return new Vector2 (0.0, 0.0);
		return anchorPositions[index];
	}
}