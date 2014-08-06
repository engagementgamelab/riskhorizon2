#pragma strict

 class ShocksCreator extends MonoBehaviour{
	private var secretKey="engagement"; // Edit this value and make sure it's the same as the one stored on the server
	var addShockUrl="addShocks.php?";//"http://ec2-54-90-200-73.compute-1.amazonaws.com/addShocks.php?"; //be sure to add a ? to your url


	
	function addShocks(
	shock_uuid : String, 
	level_uuid : String,
	instantiate_time : int,
	probability : float,
	severity : float,
	time_researched : float,
	damage : float,
	times_viewed : int,
	minigame_multiplier : float
	){
		//This connects to a server side php script that will add the name and score to a MySQL DB.
	    // Supply it with a string representing the players name and the players score.
	   
	    var hash : String = MD5Wrapper.Md5Sum(
	    shock_uuid + 
	    level_uuid + 
	    instantiate_time +
	    probability + 
	    severity + 
	    time_researched + 
	    damage + 
	    times_viewed +
	    minigame_multiplier +
	    secretKey); 
	    var session_url = addShockUrl + 
	    				  "shock_uuid=" + WWW.EscapeURL(shock_uuid) + 
	    				  "&level_uuid=" + WWW.EscapeURL(level_uuid) + 
	    				  "&instantiate_time=" + instantiate_time +
	    				  "&probability=" + probability + 
	    				  "&severity=" + severity +
	    				  "&time_researched=" + time_researched +
	    				  "&damage=" + damage +
	    				  "&times_viewed=" + times_viewed +
	    				  "&minigame_multiplier=" + minigame_multiplier +
	    				  "&hash=" + hash;
	 
	    // Post the URL to the site and create a download object to get the result.
	    var hs_post : WWW = new WWW(session_url);
	    yield hs_post; // Wait until the download is done
	    if(hs_post.error) {
	        //print("There was an error posting the high score: " + hs_post.error);

		}
	}
	
//	function GetUUID():String{
//		var uuid = SystemInfo.deviceUniqueIdentifier;
//		var actualTime = System.DateTime.Now.ToString("hh:mm:ss");
//		var date = System.DateTime.Now.ToString("MM/dd/yyyy");
//		return uuid+"-"+date+"-"+actualTime.ToString();
//
//	}		
	
//	function OnGUI () {
//		if (GUI.Button(Rect(120,70,50,30),"Click"))
//			addShocks(
//			UUIDCreator.GetUUID(),
//			LevelsCreator.storeLevel_uuid,
//			.444,
//			.270, 
//			.10, 
//			.012, 
//			.001,
//			5, 
//			.800 
//			);
//	}	



}