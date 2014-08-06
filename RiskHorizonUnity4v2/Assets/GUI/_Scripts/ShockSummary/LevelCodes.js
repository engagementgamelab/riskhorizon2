#pragma strict

class LevelCodes extends System.Object {
	
	private var level1 : String[] = [
		"39xGKVC",
		"jyWXc4T",
		"E258QGt",
		"KPe8sz6",
		"dwsEUBp",
		"DyX74nj",
		"JZf3EFB",
		"YLN96hs",
		"CJKP7XZ",
		"RXHvGPk"
	];
	
	private var level2 : String[] = [
		"49QjW9A",
		"meg3kBc",
		"wTktNq9",
		"JMkPBbE",
		"kxtuYCK",
		"D2gAsgR",
		"hkvvA2J",
		"aA3XS9Z",
		"dTCruYx",
		"SWwNUhS"
	];
	
	private var level3 : String[] = [
		"P8zCXLs",
		"2pAzjYY",
		"Mgrt5kx",
		"5WPUAhP",
		"XGrSQDU",
		"ab8ESCp",
		"BaJA5Vr",
		"BTyxjp7",
		"xGxabDR",
		"VEKYQ8k"
	];
	
	private var level4 : String[] = [
		"ss984TN",
		"yEcQvkn",
		"zF5NufK",
		"9rUGU5z",
		"PywndCZ",
		"DTBxFUZ",
		"jSfcVSk",
		"qf9T8xa",
		"CCpZDSx",
		"Pb4gzs2"
	];
	
	private var level5 : String[] = [
		"tuh5469",
		"MTFS35V",
		"wUArCmj",
		"u7hpgTP",
		"htVG9E4",
		"CfbQ8TJ",
		"wsR5GLW",
		"jgHKLZD",
		"AMLjRe3",
		"ZujHjyW"
	];
	
	private var level6 : String[] = [
		"HJqyxr",
		"7nTsSmA",
		"zDXfu8w",
		"bAG7rZ8",
		"NuFKrR2",
		"VmBtMYD",
		"8bnJswH",
		"XH8PWJW",
		"74Twg5w",
		"WPSnpgM"
	];
	
	private var winGame : String[] = [
		"s5B4tBV",
		"e6PQzkP",
		"E1CCYr0",
		"mWr3nzG",
		"0N4ndFW",
		"0yJsO8W",
		"TKRrFUc",
		"sTSgVSC",
		"GvgVz5A",
		"6eIk8DE"
	];
	
	public function GetRandomCodeFromLevel (level : int) : String {
		var c : String[] = GetCodes (level);
		var r : int = Random.Range (0, c.Length);
		return c[r];
	}
	
	public function GetCodes (level : int) : String[] {
		switch (level) {
			case 1 : return level1;
			case 2 : return level2;
			case 3 : return level3;
			case 4 : return level4;
			case 5 : return level5;
			case 6 : return level6;
			case 7 : return winGame;
		}
		return level1;
	}
}
