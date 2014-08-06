#pragma strict

class ShockReports extends MonoBehaviour {
	
	private var reports : ShockReport[] = new ShockReport[0];
	
	public function AddReport (level : int, hit : boolean, attributes : ShockAttributes, protection : float, insurance : int) {
		AddReport (level, hit, attributes, protection, insurance, 0.0, 0.0, 0);
	}
	
	public function AddReport (level : int, hit : boolean, attributes : ShockAttributes, protection : float, insurance : int, multiplier : float, damage : float, copeCost : int) {
		var report : ShockReport = new ShockReport (level, reports.Length, hit, attributes, protection, insurance, multiplier, damage, copeCost);
		reports = AppendArray (reports, report);
	}
	
	private function AppendArray (arr : ShockReport[], newVal : ShockReport) : ShockReport[] {
		var newLength : int = arr.Length + 1;
		var newArr : ShockReport[] = new ShockReport[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
	
	public function GetReports () : ShockReport[] {
		var level : int = GameController.instance.GetLevel ();
		var levelReports : ShockReport[] = new ShockReport[0];
		for (var i = 0; i < reports.Length; i ++) {
			var r : ShockReport = reports[i];
			if (r.Level == level)
				levelReports = AppendArray (levelReports, r);
		}
		return levelReports;
	}
	
	public function Reset () {
		reports = new ShockReport[0];
	}
	
	public function GetReportsTest () : ShockReport[] {
		var reportCount : int = Random.Range (3, 8);
		var testReports : ShockReport[] = new ShockReport[reportCount];
		for (var i = 0; i < reportCount; i ++) {
			var r : ShockReport = new ShockReport (
				Mathf.RoundToInt (Random.Range (0, 10)),
				i,
				(Mathf.RoundToInt (Random.Range (0, 3)) == 1),
				new ShockAttributes (
					Random.Range (5.0, 60.0),
					Random.Range (0.0, 1.0),
					Random.Range (0.0, 1.0)
				),
				Random.Range (0.0, 1.0),
				Mathf.RoundToInt (Random.Range (1, 3)),
				Random.Range (1.0, 2.0),
				Random.Range (0.0, 1.0),
				Mathf.RoundToInt (Random.Range (0, 1000))
			);
			testReports[i] = r;
		}
		return testReports;
	}
}