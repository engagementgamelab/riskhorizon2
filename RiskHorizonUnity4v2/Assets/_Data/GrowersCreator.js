#pragma strict

class GrowersCreator extends MonoBehaviour{
	private var secretKey="engagement"; // Edit this value and make sure it's the same as the one stored on the server
	var addGrowerUrl="addGrowers.php?";//"http://ec2-54-90-200-73.compute-1.amazonaws.com/addGrowers.php?"; //be sure to add a ? to your url


	
	function addGrowers(
	grower_uuid : String, 
	level_uuid : String,
	growerI : int,
	growerII : int,
	growerIII : int,
	growerIV : int,
	growerV : int,
	growerVI : int,
	growerVII : int,
	growerVIII : int,
	growerIX : int
	){
		//This connects to a server side php script that will add the name and score to a MySQL DB.
	    // Supply it with a string representing the players name and the players score.
	   
	    var hash : String = MD5Wrapper.Md5Sum(
	    grower_uuid + 
	    level_uuid + 
	    growerI +
	    growerII + 
	    growerIII + 
	    growerIV + 
	    growerV + 
	    growerVI +
	    growerVII +
	    growerVIII +
	    growerIX +
	    secretKey); 
	    var session_url = addGrowerUrl + 
	    				  "grower_uuid=" + WWW.EscapeURL(grower_uuid) + 
	    				  "&level_uuid=" + WWW.EscapeURL(level_uuid) + 
	    				  "&growerI=" + growerI +
	    				  "&growerII=" + growerII + 
	    				  "&growerIII=" + growerIII +
	    				  "&growerIV=" + growerIV +
	    				  "&growerV=" + growerV +
	    				  "&growerVI=" + growerVI +
	    				  "&growerVII=" + growerVII +
	    				  "&growerVIII=" + growerVIII +
	    				  "&growerIX=" + growerIX +
	    				  "&hash=" + hash;
	 
	    // Post the URL to the site and create a download object to get the result.
	    var hs_post : WWW = new WWW(session_url);
	    //print(session_url);
	    yield hs_post; // Wait until the download is done
	    if(hs_post.error) {
	        //print("There was an error posting the high score: " + hs_post.error);
	         //guiText.text = hs_post.error;

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
//		if (GUI.Button(Rect(220,70,50,30),"Click"))
//			addGrowers(
//			UUIDCreator.GetUUID(),
//			LevelsCreator.storeLevel_uuid,
//			0,
//			1, 
//			0, 
//			1, 
//			0,
//			1, 
//			0,
//			1,
//			0 
//			);
//	}	



}