#pragma strict

class DataController extends MonoBehaviour {

	//dataSenders
	public var sessionsCreator : SessionsCreator;
	public var shocksCreator : ShocksCreator; 
	//public var growersCreator : GrowersCreator;
	public var levelsCreator : LevelsCreator;
	
	//shocks
	private var shockreports : ShockReport[];
	//insurance
	private var boughtInsuranceI : int = 0;
	private var boughtInsuranceII  : int = 0;
	private var boughtInsuranceIII  : int = 0;
	//protection
	private var protectionEndPercent : float = 0;
	// level
	private var level : int = 0;
	// developement
	private var getDevelopementProgress : float = 0;
	// growers
	//private var growers : int[];
	
	// Send DATA To Server
	function Start() {
		sessionsCreator.addSessions(UUIDCreator.GetUUID(),"email");
	}
	
	function EndLevel(_shockreports : ShockReports,
					  _protectionEndPercent : float,
					  _level : int,
					  _getDevelopementProgress : float,
					  _growers : int[]
					  				){
	         protectionEndPercent = _protectionEndPercent;
	         level = _level;
	         getDevelopementProgress = _getDevelopementProgress;
	         shockreports = _shockreports.GetReports();
	
			levelsCreator.GrowerAndShockData(_growers, _shockreports);
	         
	         SendLevelData();
	         
	         
	
	}
	
	//------------Sessions DATA --------
	
	//SessionsCreator.addSessions(UUIDCreator.GetUUID(),"email");
	
	//----------------- Level DATA ------------
	
	function SendLevelData(){
		levelsCreator.addLevels(
							UUIDCreator.GetUUID(), 
							SessionsCreator.storeSession_uuid,
							level,
							.01,
							boughtInsuranceI,
							boughtInsuranceII,
							boughtInsuranceIII,
							getDevelopementProgress,
							protectionEndPercent,
							ShockResearchTime()
							);			
	
							
							
	}
	
	//----------------- Shock DATA----------------//
	
	//function SendShockData(){
	//	for (var i : int ; i < shockreports.Length ; i++){
	//	var shock = shockreports[i];
	//	shocksCreator.addShocks(
	//							UUIDCreator.GetUUID(),
	//							LevelsCreator.storeLevel_uuid,
	//							0,//Instantiate Time
	//							shock.HitProbability,
	//							shock.Severity,
	//							shock.Research*EarlyWarningController.maxTime,
	//							shock.Damage,
	//							0,//times_viewed,
	//							shock.Multiplier
	//							);												
	//	}
	//	Debug.Log(shockreports.Length);	
	//	
	//}	
	
	//------------------- GROWER DATA -----------------//
	
	//function SendGrowerData(){
	//	growersCreator.addGrowers(
	//						     UUIDCreator.GetUUID(), 
	//						     LevelsCreator.storeLevel_uuid,
	//						     GetGrowerLevels(0),
	//						     GetGrowerLevels(1),
	//						     GetGrowerLevels(2),
	//						     GetGrowerLevels(3),
	//						     GetGrowerLevels(4),
	//						     GetGrowerLevels(5),
	//						     GetGrowerLevels(6),
	//						     GetGrowerLevels(7),
	//						     GetGrowerLevels(8)
	//						     );		     
	//	
	//}	
	
	
									
																
	
	// --------------  INSURANCE --------------//
	
	function AddInsuranceData(plan : int){
		
		if (plan==0){boughtInsuranceI=1;}
		if (plan ==1){boughtInsuranceII=1;}
		if (plan ==2){boughtInsuranceIII=1;}
	
	}
	
	
	//----------SHOCKS------------
	
	function ShockResearchTime() : float{
		var researchTime : float = 0;
		for (var i : int ; i < shockreports.Length ; i++){
			researchTime += shockreports[i].Research*EarlyWarningController.maxTime;	 
		}
		return researchTime;
	}
	
	//function GetGrowerLevels(i : int){
	//	if (growers.Length-1<i){
	//	return 0;
	//	}
	//	return growers[i];
//}
}