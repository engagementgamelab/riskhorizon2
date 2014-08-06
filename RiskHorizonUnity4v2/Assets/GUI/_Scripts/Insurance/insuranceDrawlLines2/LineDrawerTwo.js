//import System.Collections.Generic; 
//import System.Linq;


var drawingLine = true;
//static var originSet = false;
//static var destinationSet = false;
var lineRenderer : LineRenderer;
var startWidth : float = 1.0f;
var endWidth : float = 1.0f;
var origin : Vector3;
var destination : Vector3;
var thisCamera : Camera;
var i = 2;

static var originTransform : Transform = null;
static var destinationTransform : Transform = null;


//var lines : List.<int> = new List.<int>();
//var dictionaryOfLines : Dictionary.<int,int> = new Dictionary.<int,int>();

 

function Awake(){
	lineRenderer = GetComponent(LineRenderer);
	lineRenderer.SetWidth(startWidth, endWidth);
	thisCamera = Camera.main;
}


function Update(){
	lineRenderer.SetVertexCount(i);

	//if (origin == Vector3.zero) return;
	if (originTransform == null) return;
    var mousePos = Input.mousePosition;
    mousePos.z = thisCamera.nearClipPlane+10;
    var mouseWorld = thisCamera.ScreenToWorldPoint(mousePos);          
   	if (destinationTransform == null){
    	lineRenderer.SetPosition(1, mouseWorld);
    }	 
}

public function OnSetOriginTransform (){
	lineRenderer.SetPosition(0, originTransform.position);
}

public function OnSetDestinationTransform(){
	lineRenderer.SetPosition(1, destinationTransform.position);
}

//public function SetOrigin(V3 : Vector3){
//	print("origin");
//	if (V3 == Vector3.zero){
//		lineRenderer.enabled = false;
//		return;
//	}
//	else{
//		lineRenderer.enabled = true;
//		originTransform.position = V3;
//		lineRenderer.SetPosition(0, originTransform.position);
//	}
//}

//public function SetDestination(V3 : Vector3){
//	print("destination");
//	destination = V3;
//	lineRenderer.SetPosition(1, destination);
////	drawingLine = false;
//}

//public function GetOrigin ( V3: Vector3){
//return (V3 == origin);
//}
//
