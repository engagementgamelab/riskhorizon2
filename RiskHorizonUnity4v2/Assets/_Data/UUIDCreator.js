#pragma strict


static class UUIDCreator extends MonoBehaviour{



	function GetUUID():String{
//		var platform : String = Application.platform.ToString();
		var randomNumberA : String = String.Format("{0:X}", Random.Range(0,100000000));
		var randomNumberB : String = String.Format("{0:X}", Random.Range(0,100000000));
//		var uuid = String.Format("{0:X}", Random.Next(1000000000));
//		var actualTime = System.DateTime.Now.ToString("hh:mm:ss");
//		var date = System.DateTime.Now.ToString("MM/dd/yyyy");
//		var actualTime = System.DateTime.Now.ToString();
		return randomNumberA+"-"+randomNumberB.ToString();
	
	}	
}	

//string foo = SomeRandomClassInstance + "";
//
//var foo : String = SomeRandomClassInstance +"";