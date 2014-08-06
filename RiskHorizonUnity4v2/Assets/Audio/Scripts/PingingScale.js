#pragma strict

class PingingScale extends System.Object {
	
	private var pings : boolean[];
	private var pingPoints : float[];
	private var pingCount : int = 0;
	
	public function PingingScale (_pingCount : int, scale : float) {
		pingCount = _pingCount;
		
		pings = new boolean[pingCount];
		for (var i = 0; i < pingCount; i ++) {
			pings[i] = false;
		}
		
		pingPoints = new float[pingCount];
		for (i = 0; i < pingCount; i ++) {
			pingPoints[i] = ((i + 1.0) / (pingCount + 0.0)) / scale;
		}
	}
	
	public function UpdateProgress (progress : float) {
		for (var i = 0; i < pingCount; i ++) {
			if (pings[i]) continue;
			if (progress >= pingPoints[i]) {
				if (i == pingCount - 1 || progress < pingPoints[i + 1]) {
					TriggerPing ();
					pings[i] = true;
					break;
				}
			} else {
				break;
			}
		}
	}
	
	public function TriggerPing () {
		GameController.instance.AudioPlayPing ();
	}
	
	public function Reset () {
		for (var i = 0; i < pingCount; i ++) {
			pings[i] = false;
		}
	}
}