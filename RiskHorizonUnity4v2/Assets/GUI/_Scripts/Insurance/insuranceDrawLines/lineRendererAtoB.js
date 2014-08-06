
//
//import System.Collections.Generic; 
//   
//
//   
//var linePoints : List.<Vector3> = new List.<Vector3>();    
var lineRenderer : LineRenderer;
//var startWidth : float = 1.0f;
//var endWidth : float = 1.0f;
//var threshold : float = 0.001f;
//var thisCamera : Camera;
//var lineCount : int = 0;

var origin : Transform;
var destination : Transform;
var lineDrawSpeed : float = 6f;




function Awake(){
	lineRenderer = GetComponent(LineRenderer);

}
     


function Update(){

	lineRenderer.SetPosition(0, origin.position);
	lineRenderer.SetPosition(1, destination.position);
}
     
     



