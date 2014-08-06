#pragma strict

class Cancel extends GameSprite{

	function Start(){
		InitGameSprite(3, -0.1);
		SetColor (Color.red);
	}

	function OnMouseDown(){
		GameController.instance.CloseInsurance ();
	}
}


