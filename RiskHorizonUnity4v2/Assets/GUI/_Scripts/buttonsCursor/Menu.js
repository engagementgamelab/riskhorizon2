#pragma strict


var knowledgeButtonPosx : float;
var knowledgeButtonPosy : float;
var protectionButtonPosx : float;
var protectionButtonPosy : float;
var insuranceButtonPosx : float;
var insuranceButtonPosy : float;
var developementButtonPosx : float;
var developementButtonPosy : float;


var knowledgeTexture : Texture;
var protectionTexture : Texture;
var insuranceTexture : Texture;
var developementTexture : Texture;

var knowledgeTextureUp : Texture;
var protectionTextureUp : Texture;
var insuranceTextureUp : Texture;
var developementTextureUp : Texture;

var knowledgeTexturePress : Texture;
var protectionTexturePress : Texture;
var insuranceTexturePress : Texture;
var developementTexturePress : Texture;


var cursorImageKnowledge : Texture;
var cursorImageProtection : Texture;
var cursorImageInsurance : Texture;
var cursorImageDevelopement : Texture;

var knowledge = false;
var protection = false;
var insurance = false;
var developement = false;

var skin : GUISkin = null;

var originalWidth = 960.0;  // define here the original resolution
var originalHeight = 720.0; // you used to create the GUI contents 
private var scale: Vector3;


function Start () {

	knowledgeTexture = knowledgeTextureUp;
	protectionTexture = protectionTextureUp;
	insuranceTexture = insuranceTextureUp; 
	developementTexture = developementTextureUp; 

}
 
function OnGUI(){

    scale.x = Screen.width/originalWidth; // calculate hor scale
    scale.y = Screen.height/originalHeight; // calculate vert scale
    scale.z = 1;
//    var size: Vector2 = GUI.matrix.MultiplyVector(Vector2(scale.x*100 , scale.y*100));
    
//	Vector2 size = GUI.matrix.MultiplyVector(new Vector2(rect.width, rect.height));
//    
//    return new Rect(position.x, position.y, size.x, size.y);
    
    var svMat = GUI.matrix; // save current matrix
    // substitute matrix - only scale is altered from standard
    GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);
    // draw your GUI controls here:
    GUI.skin = skin;
    var mousePos : Vector3 = Input.mousePosition;
    var pos : Rect = Rect(mousePos.x,Screen.height - mousePos.y,50,50);
    
	if (knowledge == true){
		Screen.showCursor = false;
		GUI.Label(pos,cursorImageKnowledge);
		knowledgeTexture = knowledgeTexturePress;

	}
	else{
		knowledgeTexture = knowledgeTextureUp;
	}
	
	if (protection == true){
		Screen.showCursor = false;
		GUI.Label(pos,cursorImageProtection);
		protectionTexture = protectionTexturePress;

	}
	else{
		protectionTexture = protectionTextureUp;
	}
	
	if (insurance == true){
		Screen.showCursor = false;
		GUI.Label(pos,cursorImageInsurance);
		insuranceTexture = insuranceTexturePress;

	}
	else{
		insuranceTexture = insuranceTextureUp;
	}
	
	if (developement == true){
		Screen.showCursor = false;
		GUI.Label(pos,cursorImageDevelopement);
		developementTexture = developementTexturePress;

	}
	else{
		developementTexture = developementTextureUp;
	}
	
	

	if (GUI.Button(Rect(knowledgeButtonPosx,knowledgeButtonPosy,50,50),knowledgeTexture)){
	    	knowledge = true;
	    	protection = false;
			insurance = false;
			developement = false;
	}

	

	if (GUI.Button(Rect(protectionButtonPosx,protectionButtonPosy, 50,50),protectionTexture)){
	        knowledge = false;
	    	protection = true;
			insurance = false;
			developement = false;
	}

	

    if (GUI.Button(Rect(insuranceButtonPosx,insuranceButtonPosy,50,50),insuranceTexture)){
        knowledge = false;
    	protection = false;
		insurance = true;
		developement = false;
	}	


    if (GUI.Button(Rect(developementButtonPosx,developementButtonPosy,50,50),developementTexture)){
        knowledge = false;
    	protection = false;
		insurance = false;
		developement = true;
	}

    //...
    // restore matrix before returning
    GUI.matrix = svMat; // restore matrix
}
