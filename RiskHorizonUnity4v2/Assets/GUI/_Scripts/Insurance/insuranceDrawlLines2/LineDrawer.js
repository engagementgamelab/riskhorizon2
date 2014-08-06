#pragma strict


static var drawingLine;
var lineRenderer : LineRenderer;
var startWidth : float = 1.0f;
var endWidth : float = 1.0f;

 

function Awake(){
	lineRenderer = GetComponent(LineRenderer);
	lineRenderer.SetWidth(startWidth, endWidth);
}


function Update(){
//if (origin==Vector3.zero) return;
}

   


