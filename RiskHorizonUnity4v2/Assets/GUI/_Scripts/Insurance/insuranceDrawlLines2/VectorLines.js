var numberOfPoints = 9;
var lineColor = Color.white;
var lineWidth = 3;
var drawLines = true;
var lineMaterial : Material;
private var linePoints : Vector2[];
var cam : Camera;

private var origPoints : Vector2[];
 
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
	linePoints = new Vector2[numberOfPoints];
	origPoints = new Vector2[numberOfPoints];
 
	// Plot points on a circle
//	var radians : float = 360.0/(numberOfPoints-1)*Mathf.Deg2Rad;
//	var p = 0.0;
//	for (var i = 0; i < numberOfPoints; i++) {
//		linePoints[i] = Vector2(.5 + .25*Mathf.Cos(p), .5 + .25*Mathf.Sin(p));
//		origPoints[i] = linePoints[i];
//		p += radians;
//	}
}
 
function Update () { 
	for (var i = 0; i < linePoints.Length; i++) {
		if (i%2 == 0) {var m = .4; var t = 1.0;}
		else {m = .5; t = .5;}
		linePoints[i] = (origPoints[i]-Vector2(.5, .5))*(Mathf.Sin(Time.time*t)+Mathf.PI*m)+Vector2(.5, .5);
	}
}





 
function OnPostRender () {
	if (!drawLines || !linePoints || linePoints.Length < 2) {return;}
 
	var nearClip = cam.nearClipPlane + .00001; // Add a bit, else there's flickering when the camera moves
	var end = linePoints.Length - 1;
	var thisWidth = 1.0/Screen.width * lineWidth * .5;
 
	lineMaterial.SetPass(0);
	GL.Color(lineColor);
 
	if (lineWidth == 1) {
		GL.Begin(GL.LINES);
		for (var i = 0; i < end; i++) {
			GL.Vertex(cam.ViewportToWorldPoint(Vector3(linePoints[i].x, linePoints[i].y, nearClip)));
			GL.Vertex(cam.ViewportToWorldPoint(Vector3(linePoints[i+1].x, linePoints[i+1].y, nearClip)));
		}
	}
	else {
		GL.Begin(GL.QUADS);
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
 
@script RequireComponent(Camera)