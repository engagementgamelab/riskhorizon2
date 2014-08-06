#pragma strict

static var drawingLine = true;
var lineDrawer : GameObject;
var selected = false;
var thisCamera : Camera;
var origin : Vector3;
var mouseWorld;
var destination : Vector3;
var connection = false;

function Awake (){
	thisCamera = Camera.main;
	

}
	
function OnMouseDown (){
selected = !selected;
if (selected == true){
origin=this.gameObject.transform.position;
}
else {
origin=Vector3.zero;
}

}

function OnMouseDrag(){
	var other : LineDrawer = lineDrawer.GetComponent(LineDrawer);
	if (origin == Vector3.zero) return;
    var mousePos = Input.mousePosition;
    mousePos.z = thisCamera.nearClipPlane+10;
    mouseWorld = thisCamera.ScreenToWorldPoint(mousePos);    

   	 other.lineRenderer.SetPosition(0, origin);
     other.lineRenderer.SetPosition(1, mouseWorld);	 
     

}

function OnMouseOver(){
	connection = true;
}

function OnMouseExit(){
	connection = false;
}

function OnMouseUp(){
	if (connection == true){
	destination = transform.position;
	}
	else{
	origin = Vector3.zero;
	mouseWorld = Vector3.zero;
	}
	mouseWorld = destination;
	}
 
