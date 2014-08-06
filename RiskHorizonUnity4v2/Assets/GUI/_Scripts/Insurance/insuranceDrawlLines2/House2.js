#pragma strict


static var originSet = false;
static var destinationSet = false;
public var lineDrawerTwo : LineDrawerTwo;
var selected = false;



function OnMouseDown (){
	if(lineDrawerTwo.originTransform == null && !selected){
		lineDrawerTwo.originTransform = transform;
//		originSet = true;
		selected = true;
		print("select");
		lineDrawerTwo.OnSetOriginTransform();
		return;
	}
	if(selected && lineDrawerTwo.originTransform == transform){
//		lineDrawerTwo.SetOrigin(Vector3.zero);
		lineDrawerTwo.originTransform = null;
		selected = false;	
		print("unselect");
		return;	
	}
	if(lineDrawerTwo.originTransform != null && lineDrawerTwo.originTransform != transform){
//		lineDrawerTwo.SetDestination(transform.position);
		lineDrawerTwo.destinationTransform = transform;
//		lineDrawerTwo.originTransform == null
//		originSet = false;
		lineDrawerTwo.OnSetDestinationTransform();
		print("setdestination");
	}
	
}
	
//function OnMouseDown (){
//print ("mouse");
//	if (!originSet){
//		if(!lineDrawerTwo.GetOrigin(transform.position)){
//			if (!selected){
//			SelectOrigin();
//			}
//			else  {
//				print("unselect");
//				selected = false;
//				originSet = false;
////				lineDrawerTwo.SetOrigin(Vector3.zero);
//			}
//		}
//		else{
//			SelectOrigin();
//		}
//	}
//	else {
//		lineDrawerTwo.SetDestination(transform.position);
//		//lineDrawerTwo.SetOrigin(Vector3.zero);
//		originSet = false;
//	}
//
//}		
		

//var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
//selected = !selected;
//	if(Physics.Raycast(ray,hit,1000)){
//		if (hit.transform.tag == "house" && selected == true && originSet == false){
//		lineDrawerTwo.SetOrigin(transform.position);
//		originSet = true;
//		hit.transform.tag = "origin";
//		}
//		else  {
//		print("unselect");
//		hit.transform.tag = "house";
//		selected = false;
//		originSet = false;
//		drawingLine = true;
//		lineDrawerTwo.SetOrigin(Vector3.zero);
//		}
//
//		if (hit.transform.tag == "house" && selected == false && connection == false && originSet == true){
//		lineDrawerTwo.drawingLine = false;
//		lineDrawerTwo.SetDestination(transform.position);
//		}
//}

//}


//function SelectOrigin(){
//		lineDrawerTwo.SetOrigin(transform.position);
//		originSet = true;
//		selected = true;
//}

function OnMouseOver(){
	
}

function OnMouseExit(){

}

 
