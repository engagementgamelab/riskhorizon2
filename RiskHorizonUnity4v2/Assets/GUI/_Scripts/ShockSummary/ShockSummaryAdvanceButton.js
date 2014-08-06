#pragma strict

class ShockSummaryAdvanceButton extends GameButton {
	
	public var continueButtons : Texture[];
	public var restartButtons : Texture[];
	public var continueButtonsSmall : Texture[];
	public var restartButtonsSmall : Texture[];
	
	private var cBut : Texture[];
	private var rBut : Texture[];
	
	private var summary2 : ShockSummary2;
	private var summary : ShockSummary;
	private var won : boolean = true;

	public function Create (_summary2 : ShockSummary2) {
		InitGameSprite (1, -0.1);
		SpriteTransform.position = MainCamera.SetPositionV3 (0.7, -0.7, Depth, true, true);
		if (UseSmallScreen ()) {
			cBut = continueButtonsSmall;
			rBut = restartButtonsSmall;
		} else {
			cBut = continueButtons;
			rBut = restartButtons;
		}
		hotkey = KeyCode.Return;
		summary2 = _summary2;
		SetTextures (cBut);
	}
	
	public function Show () {
		if (GameController.instance.GetLastLevel ()) {
			SetTextures (rBut);
			SetTexture (0);
			return;
		}
		won = GameController.instance.GetWon ();
		if (won) SetTextures (cBut);
		else SetTextures (rBut);
		SetTexture (0);
	}
	
	public function OnSelect () {
		summary2.OnAdvance (GameController.instance.Advance ());
	}
	
	public function SetAdvancePosition (p : Vector2) {
		SpriteTransform.position = MainCamera.SetPositionV3 (p.x, p.y, Depth, true, true);
	}
}