#pragma strict
 var rightPauseScreen : GameObject;


function Start () {

transform.position.x = rightPauseScreen.transform.position.x/1000;

}

function  FixedUpdate () {
transform.position.x = rightPauseScreen.transform.position.x/1000;
}