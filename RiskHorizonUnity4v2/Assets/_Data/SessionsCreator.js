#pragma strict
import System.Net;
//import System.Net.Sockets;
//import System.Linq;

class SessionsCreator extends MonoBehaviour{

	
	private var secretKey="engagement"; // Edit this value and make sure it's the same as the one stored on the server
	var addSessionUrl="addSessions.php?";//"http://ec2-54-90-200-73.compute-1.amazonaws.com/addSessions.php?"; //be sure to add a ? to your url
	private var debugText : String = "...";
//  	var emailSkin : GUISkin;
//  	var email : String = "Enter Email";


	
	static var storeSession_uuid : String;
	 
	function Start() {
	//	getScores();
	}
	 
	function addSessions(session_uuid : String, email : String) {
	    //This connects to a server side php script that will add the name and score to a MySQL DB.
	    // Supply it with a string representing the players name and the players score.
	    storeSession_uuid = session_uuid;
	    var hash : String = MD5Wrapper.Md5Sum(session_uuid + email + secretKey); 
	 
	    var session_url = addSessionUrl + "session_uuid=" + WWW.EscapeURL(session_uuid) + "&email=" + WWW.EscapeURL(email) + "&hash=" + hash;
//	 	print(session_url);
	    // Post the URL to the site and create a download object to get the result.
	    var hs_post : WWW = new WWW(session_url);
	    yield hs_post; // Wait until the download is done
	    if(hs_post.error) {
	        print("There was an error posting the session data: " + hs_post.error);
	        debugText = hs_post.error;
//	        guiText.text = hs_post.error;
	    }
	}
	
	/*function OnGUI () {
		GUI.Label (new Rect (10, 10, 500, 200), debugText);
	}*/
	
	
//	function GetIPv4():String{
//		var strHostName : String = "";
//		strHostName = System.Net.Dns.GetHostName();
//		 
//		var ipEntry  : IPHostEntry = System.Net.Dns.GetHostEntry(strHostName);
//		 
//		var addr : IPAddress[] = ipEntry.AddressList;
//		 
//		return addr[addr.Length-1].ToString();
//
////	var firstIPv4Address = Dns.GetHostEntry(Dns.GetHostName());
////	return firstIPv4Address.ToString();
//
//	 
//	}	
	
		
		
//	function OnGUI () {
////		GUI.skin = emailSkin;
//		// Make a text field that modifies stringToEdit.
////		email = GUILayout.TextField (email, 25);
//		//		scoreToEdit = GUILayout.TextField (scoreToEdit, 50);
//		if (GUI.Button(Rect(10,70,50,30),"Click"))
//			addSessions(UUIDCreator.GetUUID(),email);
//
//
//
//	}	
		
	
	
}	
	
	
	
	

