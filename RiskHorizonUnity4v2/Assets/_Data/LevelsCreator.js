#pragma strict

class LevelsCreator extends MonoBehaviour {

	public var shocksCreator : ShocksCreator; 
	public var growersCreator : GrowersCreator;
	
	private var shockreports : ShockReport[];
	private var growers : int[];
	private var secretKey="engagement"; // Edit this value and make sure it's the same as the one stored on the server
	public var addLevelUrl="addLevels.php?";//"http://ec2-54-90-200-73.compute-1.amazonaws.com/addLevels.php?"; //be sure to add a ? to your url

	static var storeLevel_uuid : String;
	
	function GrowerAndShockData (_growers : int[], _shockreports : ShockReports) {
         shockreports = _shockreports.GetReports();
         growers = _growers;
	}

	function addLevels (
		level_uuid : String, 
		session_uuid : String,
		level : int,
		pause_time : float,
		insuranceI : int,
		insuranceII : int,
		insuranceIII : int,
		development_end_percent : float,
		protection_end_percent : float,
		knowledge_time : float
		) {
		
		//This connects to a server side php script that will add the name and score to a MySQL DB.
	    // Supply it with a string representing the players name and the players score.
	   storeLevel_uuid = level_uuid;
	   
	    var hash : String = MD5Wrapper.Md5Sum (
		    level_uuid + 
		    session_uuid + 
		    level +
		    pause_time + 
		    insuranceI + 
		    insuranceII + 
		    insuranceIII + 
		    development_end_percent +
		    protection_end_percent +
		    knowledge_time +
		    secretKey
		); 
	    
	    var session_url = addLevelUrl + 
			"level_uuid=" + WWW.EscapeURL(level_uuid) + 
			"&session_uuid=" + WWW.EscapeURL(session_uuid) + 
			"&level=" + level +
			"&pause_time=" + pause_time + 
			"&insuranceI=" + insuranceI +
			"&insuranceII=" + insuranceII +
			"&insuranceIII=" + insuranceIII +
			"&development_end_percent=" + development_end_percent +
			"&protection_end_percent=" + protection_end_percent +
			"&knowledge_time=" + knowledge_time +
			"&hash=" + hash;
	 
	    // Post the URL to the site and create a download object to get the result.
	    var hs_post : WWW = new WWW(session_url);
	    yield hs_post; // Wait until the download is done
	    
	    SendShockData();
	    SendGrowerData();
	    
	    if (hs_post.error) {
	        //print("There was an error posting the high score: " + hs_post.error);
		}
	}	
			
	function SendShockData () {
		for (var i : int ; i < shockreports.Length ; i++){
			var shock = shockreports[i];
			shocksCreator.addShocks(
				UUIDCreator.GetUUID(),
				LevelsCreator.storeLevel_uuid,
				0,//Instantiate Time
				shock.HitProbability,
				shock.Severity,
				shock.Research*EarlyWarningController.maxTime,
				shock.Damage,
				0,//times_viewed,
				shock.Multiplier
			);												
		}
		//Debug.Log (shockreports.Length);	
	}	

	function SendGrowerData () {
		growersCreator.addGrowers(
			UUIDCreator.GetUUID(), 
			LevelsCreator.storeLevel_uuid,
			GetGrowerLevels(0),
			GetGrowerLevels(1),
			GetGrowerLevels(2),
			GetGrowerLevels(3),
			GetGrowerLevels(4),
			GetGrowerLevels(5),
			GetGrowerLevels(6),
			GetGrowerLevels(7),
			GetGrowerLevels(8)
		);		     
	}	
		
	function GetGrowerLevels (i : int) {
		if (growers.Length - 1 < i) {
			return 0;
		}
		return growers[i];
	}
}
	
//	function GetUUID():String{
//		var uuid = SystemInfo.deviceUniqueIdentifier;
//		var actualTime = System.DateTime.Now.ToString("hh:mm:ss");
//		var date = System.DateTime.Now.ToString("MM/dd/yyyy");
//		return uuid+"-"+date+"-"+actualTime.ToString();
//	}		
	
//	function OnGUI () {
//		if (GUI.Button(Rect(70,70,50,30),"Click"))
//			addLevels(
//			UUIDCreator.GetUUID(),
//			SessionsCreator.storeSession_uuid,
//			6,
//			1.270, 
//			1, 
//			0, 
//			0, 
//			.750, 
//			.800, 
//			.900
//			);
//	}	



