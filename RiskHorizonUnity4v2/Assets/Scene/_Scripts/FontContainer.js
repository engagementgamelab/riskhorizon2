#pragma strict

class FontContainer extends MonoBehaviour {
	
	public var fDefault : Font[];
	public var mDefault : Material[];
	
	public var f2048 : Font[];
	public var f1024 : Font[];
	public var f512 : Font[];
	public var f256 : Font[];
	
	public var m2048 : Material[];
	public var m1024 : Material[];
	public var m512 : Material[];
	public var m256 : Material[];
	
	private var size : int;
	
	static var instance : FontContainer;
	
	function Awake () {
		if (instance == null) instance = this;
	}
	
	function OnSetScreenSize () {
		var w : int = MainCamera.GetTargetWidth ();
		if (w < 768) {
			size = 0;
		} else if (w < 1024) {
			size = 1;
		} else if (w < 2048) {
			size = 2;
		} else {
			size = 3;
		}
	}
	
	public function GetDefaultLarge () : Font {
		return fDefault[0];
	}
	
	public function GetDefaultMedium () : Font {
		return fDefault[1];
	}
	
	public function GetDefaultMediumSmall () : Font {
		return fDefault[2];
	}
	
	public function GetDefaultSmall () : Font {
		return fDefault[3];
	}
	
	public function GetLarge () : Font {
		var f : Font[] = GetFontSize ();
		return f[0];
	}
	
	public function GetMedium () : Font {
		var f : Font[] = GetFontSize ();
		return f[1];
	}
	
	public function GetMediumSmall () : Font {
		var f : Font[] = GetFontSize ();
		return f[2];
	}
	
	public function GetSmall () : Font {
		var f : Font[] = GetFontSize ();
		return f[3];
	}
	
	public function GetLargeWhite () : Material {
		var m : Material[] = GetMaterialSize ();
		return m[0];
	}
	
	public function GetLargeYellow () : Material {
		var m : Material[] = GetMaterialSize ();
		return m[1];
	}
	
	public function GetLargeRed () : Material {
		var m : Material[] = GetMaterialSize ();
		return m[2];
	}
	
	public function GetMediumSmallWhite () : Material {
		var m : Material[] = GetMaterialSize ();
		return m[3];
	}
	
	public function GetMediumSmallYellow () : Material {
		var m : Material[] = GetMaterialSize ();
		return m[4];
	}
	
	public function GetMediumSmallGrey () : Material {
		var m : Material[] = GetMaterialSize ();
		return m[5];
	}
	
	public function GetDefaultLargeWhite () : Material {
		return mDefault[0];
	}
	
	public function GetDefaultLargeYellow () : Material {
		return mDefault[1];
	}
	
	public function GetDefaultLargeRed () : Material {
		return mDefault[2];
	}
	
	public function GetDefaultMediumSmallWhite () : Material {
		return mDefault[3];
	}
	
	private function GetFontSize () : Font[] {
		if (size == 0) return f256;
		if (size == 1) return f512;
		if (size == 2) return f1024;
		return f2048;
	}
	
	private function GetMaterialSize () : Material[] {
		if (size == 0) return m256;
		if (size == 1) return m512;
		if (size == 2) return m1024;
		return m2048;
	}
}