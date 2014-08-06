function calledFromActionScript(lvl)
{
    getCode(lvl);
}

var codes = [
["39xGKVC",
"jyWXc4T",
"E258QGt",
"KPe8sz6",
"dwsEUBp",
"DyX74nj",
"JZf3EFB",
"YLN96hs",
"CJKP7XZ",
"RXHvGPk"]
,
["49QjW9A",
"meg3kBc",
"wTktNq9",
"JMkPBbE",
"kxtuYCK",
"D2gAsgR",
"hkvvA2J",
"aA3XS9Z",
"dTCruYx",
"SWwNUhS"]
,
["P8zCXLs",
"2pAzjYY",
"Mgrt5kx",
"5WPUAhP",
"XGrSQDU",
"ab8ESCp",
"BaJA5Vr",
"BTyxjp7",
"xGxabDR",
"VEKYQ8k"]
,
["ss984TN",
"yEcQvkn",
"zF5NufK",
"9rUGU5z",
"PywndCZ",
"DTBxFUZ",
"jSfcVSk",
"qf9T8xa",
"CCpZDSx",
"Pb4gzs2"]
,
["tuh5469",
"MTFS35V",
"wUArCmj",
"u7hpgTP",
"htVG9E4",
"CfbQ8TJ",
"wsR5GLW",
"jgHKLZD",
"AMLjRe3",
"ZujHjyW"]
,
["FHJqyxr",
"7nTsSmA",
"zDXfu8w",
"bAG7rZ8",
"NuFKrR2",
"VmBtMYD",
"8bnJswH",
"XH8PWJW",
"74Twg5w",
"WPSnpgM"]
,
["s5B4tBV",
"e6PQzkP",
"E1CCYr0",
"mWr3nzG",
"0N4ndFW",
"0yJsO8W",
"TKRrFUc",
"sTSgVSC",
"GvgVz5A",
"6eIk8DE"
]
];

function getCode(lvlNum)
{	
	var lvl = parseInt(lvlNum)-1;

	var rnd = Math.floor(Math.random()*codes[lvl].length);

	alert("Please copy the following code for later use: " + codes[lvl][rnd]);
}