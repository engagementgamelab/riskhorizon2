#pragma strict

var growerMenu : GrowerMenu;

public var state : String;

function Start () {
	state = "fix";
}

function OnMouseDown(){
	//growerMenu.Create(transform.position, this);
}

function SetState(word : String){
	state = word;
}