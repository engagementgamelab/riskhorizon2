#pragma strict

var sign : Sign;

function Start () {
//	growerTexture = gameObject.Sign.GUITexture.texture;
	gameObject.transform.position.x = 100;
}

function Create (V3 : Vector3, grower : GrowerRename){
	transform.position = V3;
	SetTexture(grower.state);
		
}

function SetTexture (word : String){
	//sign.AssignTexture(word);

}

function Reset (V3 : Vector3){
	transform.position = V3;
}