 


//    using System.Collections.Generic;
//    using UnityEngine;
//     
//    [RequireComponent(typeof(LineRenderer))]
//    public class LineRendererTest : MonoBehaviour
//    {

import System.Collections.Generic; 
   
//    List<Vector3> linePoints = new List<Vector3>();
//    LineRenderer lineRenderer;
//    public float startWidth = 1.0f;
//    public float endWidth = 1.0f;
//    public float threshold = 0.001f;
//    Camera thisCamera;
//    int lineCount = 0;
//    
//        Vector3 lastPos = Vector3.one * float.MaxValue;   
   
var linePoints : List.<Vector3> = new List.<Vector3>();    
var lineRenderer : LineRenderer;
var startWidth : float = 1.0f;
var endWidth : float = 1.0f;
var threshold : float = 0.001f;
var thisCamera : Camera;
var lineCount : int = 0;


var lastPos : Vector3 = Vector3.one * float.MaxValue;
     
     
     
//    void Awake()
//    {
//    thisCamera = Camera.main;
//    lineRenderer = GetComponent<LineRenderer>();
//    }

function Awake(){
	thisCamera = Camera.main;
	lineRenderer = GetComponent(LineRenderer);

}
     
//    void Update()
//    {
//    Vector3 mousePos = Input.mousePosition;
//    mousePos.z = thisCamera.nearClipPlane;
//    Vector3 mouseWorld = thisCamera.ScreenToWorldPoint(mousePos);
//     
//    float dist = Vector3.Distance(lastPos, mouseWorld);
//     
//    if(dist <= threshold)
//    return;
//     
//    lastPos = mouseWorld;
//    if(linePoints == null)
//    linePoints = new List<Vector3>();
//    linePoints.Add(mouseWorld);
//     
//    UpdateLine();
//    }

function Update(){

    var mousePos = Input.mousePosition;
    mousePos.z = thisCamera.nearClipPlane+10;
    var mouseWorld = thisCamera.ScreenToWorldPoint(mousePos);

    var dist : float =  Vector3.Distance(lastPos, mouseWorld);

     
    if(dist <= threshold){
    return;
    } 
    
    lastPos = mouseWorld;
    
    if(linePoints == null){
    linePoints = new List.<Vector3>();
    }
    
    linePoints.Add(mouseWorld);
    UpdateLine();

}
     
     
//    void UpdateLine()
//    {
//    lineRenderer.SetWidth(startWidth, endWidth);
//    lineRenderer.SetVertexCount(linePoints.Count);
//     
//    for(int i = lineCount; i < linePoints.Count; i++)
//    {
//    lineRenderer.SetPosition(i, linePoints[i]);
//    }
//    lineCount = linePoints.Count;
//    }
//    
// }

function UpdateLine(){
    lineRenderer.SetWidth(startWidth, endWidth);
    lineRenderer.SetVertexCount(linePoints.Count);
     
    for(var i = lineCount; i < linePoints.Count; i++)
    {
    lineRenderer.SetPosition(i, linePoints[i]);
    }
    lineCount = linePoints.Count;
}
    
