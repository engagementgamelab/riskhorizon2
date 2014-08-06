#pragma strict

class MiniGameController extends PlotPositions {
	
	public var clock : MiniGameClock;
	public var overlay : MiniGameOverlay;
	public var mgAudio : MiniGameAudio;
	
	var lineDrawingScript : LineDrawingScript;
	private var connectors : Connector[] = new Connector[9];
	var connectorCount : int = 0;
	public var connector : GameObject;
	//var connectorsIndex : int = 0;
	private var createConnectorsCount : int = 2;
	private var connectionsMadeCount : int = 0;
	
	private var open : boolean = false;
	private var cost : float;
	
	private var yMin : float;
	private var yMax : float;
	
	function OnStart () {
		cost = 0; //WealthController.WealthValue (0.01);
		yMin = transform.position.y;
		yMax = transform.position.y + MainCamera.GetHeight () * 0.33;
	}
	
	public function StartGame () {
		lineDrawingScript.gameObject.SetActiveRecursively (true);
		overlay.gameObject.SetActiveRecursively (true);
		createConnectorsCount = 2;
		overlay.FadeIn (0.5);
		Open ();
	}
	
	function Open () {
		if (open) return;
		transform.position.y = Mathf.Floor (Mathf.Lerp (yMin, yMax, GameController.instance.GetTotalProtection ()));
		ActivateRandomConnectors ();
		open = true;
		clock.gameObject.SetActiveRecursively (true);
		clock.StartCountdown ();
	}
	
	function Close (playAudio : boolean) {
		connectionsMadeCount = 0;
		if (playAudio) mgAudio.PlayComplete ();
		lineDrawingScript.ResetPoints (0);
		ResetConnectors ();
		open = false;
	}
	
	public function EndGame () {
		Close (false);
		clock.StopCountdown ();
		clock.gameObject.SetActiveRecursively (false);
		overlay.FadeOut (0.5);
		lineDrawingScript.gameObject.SetActiveRecursively (false);
	}
	
	public function OnSetPosition (p : Vector3) {
		var go : GameObject = GameObject.Instantiate (connector, p, Quaternion.identity);
		go.transform.parent = transform;
		connectors[connectorCount] = go.GetComponent(Connector);
		//connectors[connectorCount].gameObject.SetActiveRecursively(false);
		connectors[connectorCount].Destroy ();
		connectorCount ++;
	}
	
	public function ActivateRandomConnectors () {
		//connectorsIndex = Random.Range (2, 10);
		var activeConnectorsCount : int = 0;
		while (activeConnectorsCount < createConnectorsCount){
			var i : int = Random.Range (0, 9);
			if (!connectors[i].gameObject.active){
				connectors[i].gameObject.SetActiveRecursively(true);
				connectors[i].Create ();
				//connectors[i].ResetConnector();
				activeConnectorsCount ++;				
			}

		}
		RandomizeBuiltinArray(connectors);
		FindSelectable().SetSelectable();
		if (createConnectorsCount < 9) {
			createConnectorsCount ++;
		} else {
			createConnectorsCount = 2;
		}
	}
	
	function ResetConnectors () {
		for( var i : int = 8; i > -1 ; i--){ 
			if (!connectors[i].gameObject.active) continue;
			connectors[i].gameObject.SetActiveRecursively(false);
		}
	}
	
	function ConnectorSelected (v2 : Vector2, connectorCheck : Connector) : boolean {
		if (FindSelectable() == connectorCheck) {
			connectionsMadeCount ++;
			
			var nextSelectable : Connector = FindNextSelectable(connectorCheck);
			if (nextSelectable == null){
				if (GameController.instance.MiniGameConnectionComplete (cost)) {
					Close (true);
					Open ();
				} else {
					Close (false);
				}
			} else {
				mgAudio.PlayConnection ();//(connectionsMadeCount);
				lineDrawingScript.SetPoints(v2);	
				FindNextSelectable(connectorCheck).SetSelectable();
				return true;
			}		
		}
		return false;
	}

	function FindSelectable () : Connector {
	
		for( var i : int = 8; i > -1 ; i--){ 
			if(!connectors[i].gameObject.active) continue;
			if(connectors[i].isActive == false) continue;
			return connectors[i];
		}
		return null;
	}

	function FindNextSelectable (lastActive : Connector):Connector{
	
		for( var i : int = 8; i > -1 ; i--){ 
			if(!connectors[i].gameObject.active) continue;
			if(lastActive == connectors [i]) continue;
			if(connectors[i].isActive == false) continue;
			return connectors[i];
		}
		return null;
	}
	
	function RandomizeBuiltinArray (arr : Connector[]){
	    for (var i = arr.Length - 1; i > 0; i--) {
	        var r = Random.Range(0,i);
	        var tmp = arr[i];
	        arr[i] = arr[r];
	        arr[r] = tmp;
	    }
	}
	
	public function PauseTime () {
		clock.Pause ();
	}
	
	public function ResumeTime () {
		clock.Resume ();
	}
}	
