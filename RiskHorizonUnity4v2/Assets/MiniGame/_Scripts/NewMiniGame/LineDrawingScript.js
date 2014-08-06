#pragma strict

@script RequireComponent(Camera)

var lineColor = Color.white;
var lineWidth = 10; 
var drawLines = false;

var isDrawing = true;
var mousePos : Vector3;
var screenPoint: Vector3;

private var lineMaterial : Material;
private var linePoints : Vector2[] = new Vector2[0];
private var cam : Camera;


function Awake () {
	lineMaterial = new Material( "Shader \"Lines/Colored Blended\" {" +
		"SubShader { Pass {" +
		"   BindChannels { Bind \"Color\",color }" +
		"   Blend SrcAlpha OneMinusSrcAlpha" +
		"   ZWrite Off Cull Off Fog { Mode Off }" +
		"} } }");
	lineMaterial.hideFlags = HideFlags.HideAndDontSave;
	lineMaterial.shader.hideFlags = HideFlags.HideAndDontSave;
	cam = camera;
}

function Start () {
	cam.orthographicSize = Screen.height / 2;
}

function Update (){
	if (!isDrawing) return;
	mousePos = Input.mousePosition;
}

function SetPoints(v2:Vector2){
	isDrawing = true;
	var viewpoint : Vector3 = camera.WorldToViewportPoint(new Vector3(v2.x,v2.y,0)); 
	linePoints = AppendArray(linePoints, new Vector2(viewpoint.x,viewpoint.y));
}

function ResetPoints (x : int) {
	linePoints = new Vector2[x];
}

private function AppendArray (arr : Vector2[], newVal : Vector2) : Vector2[] {
	var newLength : int = arr.Length + 1;
	var newArr : Vector2[] = new Vector2[newLength];
	for (var i = 0; i < arr.Length; i ++) {
		newArr[i] = arr[i];
	}
	newArr[newLength - 1] = newVal;
	return newArr;
}

function OnPostRender () {


	if (!drawLines || !linePoints || linePoints.Length == 0) {return;}

	var nearClip = cam.nearClipPlane + .00001; // Add a bit, else there's flickering when the camera moves
	var end = linePoints.Length - 1;
	var thisWidth = 1.0/Screen.width * lineWidth * .5;
 
	lineMaterial.SetPass(0);
	GL.Color(lineColor);
 
	if (lineWidth == 1) {
		GL.Begin(GL.LINES);
		GL.Vertex(cam.ViewportToWorldPoint(Vector3(linePoints[end].x, linePoints[end].y, nearClip)));
		GL.Vertex(cam.ViewportToWorldPoint(Vector3(mousePos.x/Screen.width, mousePos.y/Screen.height, nearClip)));
		for (var i = 0; i < end; i++) {
			GL.Vertex(cam.ViewportToWorldPoint(Vector3(linePoints[i].x, linePoints[i].y, nearClip)));
			GL.Vertex(cam.ViewportToWorldPoint(Vector3(linePoints[i+1].x, linePoints[i+1].y, nearClip)));
		}
	}
	else {
		GL.Begin(GL.QUADS);
			var perpendicularA = (Vector3(mousePos.y/Screen.height, linePoints[end].x, nearClip) -
								 Vector3(linePoints[end].y, mousePos.x/Screen.width, nearClip)).normalized * thisWidth;
			var v1A = Vector3(linePoints[end].x, linePoints[end].y, nearClip);
			var v2A = Vector3(mousePos.x/Screen.width, mousePos.y/Screen.height, nearClip);
			GL.Vertex(cam.ViewportToWorldPoint(v1A - perpendicularA));
			GL.Vertex(cam.ViewportToWorldPoint(v1A + perpendicularA));
			GL.Vertex(cam.ViewportToWorldPoint(v2A + perpendicularA));
			GL.Vertex(cam.ViewportToWorldPoint(v2A - perpendicularA));		
		for (i = 0; i < end; i++) {
			var perpendicular = (Vector3(linePoints[i+1].y, linePoints[i].x, nearClip) -
								 Vector3(linePoints[i].y, linePoints[i+1].x, nearClip)).normalized * thisWidth;
			var v1 = Vector3(linePoints[i].x, linePoints[i].y, nearClip);
			var v2 = Vector3(linePoints[i+1].x, linePoints[i+1].y, nearClip);
			GL.Vertex(cam.ViewportToWorldPoint(v1 - perpendicular));
			GL.Vertex(cam.ViewportToWorldPoint(v1 + perpendicular));
			GL.Vertex(cam.ViewportToWorldPoint(v2 + perpendicular));
			GL.Vertex(cam.ViewportToWorldPoint(v2 - perpendicular));
		}
	}
	GL.End();
}
 
 
function OnApplicationQuit () {
	DestroyImmediate(lineMaterial);
}
