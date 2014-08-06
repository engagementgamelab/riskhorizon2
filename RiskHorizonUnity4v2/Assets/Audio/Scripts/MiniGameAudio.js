#pragma strict

class MiniGameAudio extends MonoBehaviour {
	
	public var soundEffect : SoundEffect;
	public var complete : AudioClip;
	public var clips : AudioClip[];
	private var tones : SoundEffect[];
	private var completeFX : SoundEffect;
	
	private var audioEnabled : boolean = true;
	
	function Awake () {
		tones = new SoundEffect[clips.Length];
		for (var i = 0; i < tones.Length; i ++) {
			tones[i] = Instantiate (soundEffect).GetComponent (SoundEffect);
			tones[i].Create (clips[i]);
			tones[i].SetVolume (0.75);
			tones[i].gameObject.SetActiveRecursively (false);
		}
		
		completeFX = Instantiate (soundEffect).GetComponent (SoundEffect);
		completeFX.Create (complete);
		completeFX.SetVolume (1.5);
		completeFX.gameObject.SetActiveRecursively (false);
	}
	
	public function PlayComplete () {
		if (!audioEnabled) return;
		completeFX.gameObject.SetActiveRecursively (true);
		completeFX.Play ();
	}
	
	public function PlayConnection (index : int) {
		if (!audioEnabled) return;
		if (index > tones.Length - 1) index = Mathf.Abs (tones.Length - 1 - index);
		tones[index].gameObject.SetActiveRecursively (true);
		tones[index].Play ();
	}
	
	public function PlayConnection () {
		if (!audioEnabled) return;
		var index : int = Random.Range (0, tones.Length - 1);
		tones[index].gameObject.SetActiveRecursively (true);
		tones[index].Play ();
	}
}