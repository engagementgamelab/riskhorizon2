#pragma strict

class AudioController extends MonoBehaviour {
	
	public var humController : HumController;
	public var soundEffect : SoundEffect;
	public var music : AudioClip[];
	public var clips : AudioClip[];
	
	private var soundtracks : SoundEffect[];
	private var effects : SoundEffect[];
	
	private var musicEnabled : boolean = true;
	private var audioEnabled : boolean = true;
	
	private var protectionPing : PingingScale;
	private var protection : float = 0.0;
	
	private var growerPans : float[] = [ 0.0, 0.0, 0.33, 0.75, 0.33, 0.0, -0.33, -0.75, -0.33 ];
	private var growerPanVolumes : float[] = [ 1.0, 1.0, 2.0, 3.0, 2.0, 1.0, 2.0, 3.0, 2.0 ];
	
	private var severity : float = 0.0;
	
	function Awake () {
		
		humController = Instantiate (humController);
		
		soundtracks = new SoundEffect[music.Length];
		for (var i = 0; i < music.Length; i ++) {
			soundtracks[i] = Instantiate (soundEffect).GetComponent (SoundEffect);
			soundtracks[i].Create (music[i]);
		}
		
		effects = new SoundEffect[clips.Length];
		for (i = 0; i < clips.Length; i ++) {
			effects[i] = Instantiate (soundEffect).GetComponent (SoundEffect);
			effects[i].Create (clips[i]);
			effects[i].gameObject.SetActiveRecursively (false);
		}
	}
	
	function Start () {
		Messenger.instance.Listen ("update protection", this);
		Messenger.instance.Listen ("wealth insufficient", this);
		protectionPing = new PingingScale (10, 1.0);
	}
	
	public function Loop (effect : SoundEffect) {
		if (!audioEnabled) return;
		effect.gameObject.SetActiveRecursively (true);
		effect.Loop ();
	}
	
	public function FadeIn (effect : SoundEffect, time : float) {
		if (!audioEnabled) return;
		effect.gameObject.SetActiveRecursively (true);
		effect.FadeIn (time);
	}
	
	public function FadeIn (effect : SoundEffect, time : float, play : boolean, loop : boolean) {
		if (!audioEnabled) return;
		effect.gameObject.SetActiveRecursively (true);
		effect.FadeIn (time, play, loop);
	}
	
	public function FadeOut (effect : SoundEffect, time : float) {
		if (!audioEnabled) return;
		effect.gameObject.SetActiveRecursively (true);
		FadeOut (effect, time, false);
	}
	
	public function FadeOut (effect : SoundEffect, time : float, stopOnEndFade : boolean) {
		if (!audioEnabled) return;
		effect.gameObject.SetActiveRecursively (true);
		effect.FadeOut (time, stopOnEndFade);
	}
	
	public function GetSoundtrack (soundtrack : String) {
		for (var i = 0; i < music.Length; i ++) {
			if (music[i].name == soundtrack) {
				return soundtracks[i];
			}
		}
		return null;
	}
	
	public function GetSoundtrack (index : int) {
		return soundtracks[index];
	}
	
	public function GetEffect (index : int) {
		return effects[index];
	}
	
	public function Play (clip : String) {
		if (!audioEnabled) return;
		for (var i = 0; i < clips.Length; i ++) {
			if (clips[i].name == clip) {
				effects[i].gameObject.SetActiveRecursively (true);
				effects[i].Play ();
				return;
			}
		}
	}
	
	public function Play (clip : AudioClip) {
		if (!audioEnabled) return;
		for (var i = 0; i < clips.Length; i ++) {
			if (clips[i] == clip) {
				effects[i].gameObject.SetActiveRecursively (true);
				effects[i].Play ();
				return;
			}
		}
	}
	
	public function Play (i : int) {
		if (!audioEnabled) return;
		effects[i].gameObject.SetActiveRecursively (true);
		effects[i].Play ();
	}
	
	public function PlayRandomPitched (i : int, range : float) {
		if (!audioEnabled) return;
		effects[i].gameObject.SetActiveRecursively (true);
		effects[i].PlayRandomPitched (range);
	}
	
	public function StartGame () {
		if (!musicEnabled) return;
		if (!audioEnabled) return;
		Loop (GetSoundtrack (0));
		Loop (GetSoundtrack (1));
		GetSoundtrack (1).SetVolume (0.0);
	}
	
	public function EndLevel (won : boolean) {
		if (won) Play (1);
		else Play (2);
		FadeOut (GetSoundtrack (0), 1.0);
		FadeIn (GetSoundtrack (1), 1.0);
		
		if (!audioEnabled) return;
		//humController.StopHums ();
	}
	
	public function StartLevel () {
		FadeIn (GetSoundtrack (0), 5.0);
		FadeOut (GetSoundtrack (1), 1.0);
		
		if (!audioEnabled) return;
		//humController.PlayHums ();
	}
	
	public function Pause () {
		FadeOut (GetSoundtrack (0), 1.0);
		FadeIn (GetSoundtrack (1), 1.0);
	}
	
	public function Resume () {
		FadeIn (GetSoundtrack (0), 1.0);
		FadeOut (GetSoundtrack (1), 1.0);
	}
	
	public function GrowerBuildAction (action : Grower.BuildAction, id : int) {
		switch (action) {
			case Grower.BuildAction.Build : BuildGrower (id); break;
			case Grower.BuildAction.Upgrade : UpgradeGrower (id); break;
			case Grower.BuildAction.Cope : RepairGrower (id); break;
		}
	}
	
	private function BuildGrower (id : int) {
		GetEffect (17).SetPan (growerPans [id]);
		GetEffect (17).SetVolume (growerPanVolumes [id]);
		Play (17);
	}
	
	private function UpgradeGrower (id : int) {
		GetEffect (18).SetPan (growerPans [id]);
		GetEffect (18).SetVolume (growerPanVolumes [id]);
		Play (18);
	}
	
	private function RepairGrower (id : int) {
		GetEffect (6).SetPan (growerPans [id]);
		GetEffect (6).SetVolume (growerPanVolumes [id]);
		Play (15);
	}
	
	public function FinishGrowerAction (grower : Grower) {
		if (grower.GetDevelopment ().Damaged) return;
		GetEffect (6).SetPan (growerPans [grower.ID]);
		GetEffect (6).SetVolume (growerPanVolumes [grower.ID]);
		PlayRandomPitched (6, 0.1);
		
		if (!audioEnabled) return;
		//humController.PlayHum (grower);
	}
	
	public function StartProtection () {
		FadeIn (GetEffect (7), 0.1, true, true);
	}
	
	public function StopProtection () {
		FadeOut (GetEffect (7), 2.0, true);
	}
	
	public function ShockHit () {
		severity = GameController.instance.CalculateSeverity ();
		Play (12);
	}
	
	public function ShockWave () {
		severity = GameController.instance.CalculateSeverity ();
		GetEffect (13).SetVolume (severity);
		Play (13);
	}
	
	public function ShockDamage () {
		GetEffect (14).SetVolume (severity);
		Play (14);
		
		if (!audioEnabled) return;
		//humController.StopHums ();
	}
	
	public function StartViewingShock () {
		PlayClick1 ();
		FadeIn (GetEffect (11), 1.0, true, true);
	}
	
	public function StopViewingShock () {
		PlayClick2 ();
		FadeOut (GetEffect (11), 1.0, true);
	}
	
	public function PlayPing () {
		Play (8);
	}
	
	public function PlayClick1 () {
		Play (9);
	}
	
	public function PlayClick2 () {
		Play (10);
	}
	
	public function Reset () {
		//humController.Reset ();
	}
	
	public function DevGoalReached () {
		Play (16);
	}
	
	function _UpdateProtection () {
		if (!audioEnabled) return;
		var p : float = GameController.instance.GetTotalProtection ();
		if (p < protection) {
			protectionPing.Reset ();
		} else {
			protectionPing.UpdateProgress (Mathf.Round (p * 10.0) / 10.0);
		}
		protection = p;
	}
	
	function _WealthInsufficient () {
		GetEffect (19).SetVolume (2);
		Play (19);
	}
}