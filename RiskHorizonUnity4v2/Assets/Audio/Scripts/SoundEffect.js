#pragma strict

class SoundEffect extends MonoBehaviour {
	
	private var volume : float = 1.0;
	
	private var fadeVolume : float = 1.0;
	private var fading : boolean = false;
	private var fromVolume : float = 0.0;
	private var toVolume : float = 0.0;
	private var fadeTime : float = 0.0;
	private var elapsedFadeTime : float = 0.0;
	private var stopOnEndFade : boolean = false;
	private var duration : float;
	
	public function get Volume () : float { return volume; }
	public function set Volume (value : float) { volume = value; }
	public function get FadeVolume () : float { return fadeVolume; }
	
	function Create (clip : AudioClip) {
		audio.clip = clip;
		duration = audio.clip.length;
	}
	
	public function SetVolume (v : float) {
		audio.volume = v;
	}
	
	public function Loop () {
		audio.loop = true;
		audio.Play ();
	}
	
	public function SetPitch (semitones : int) {
		if (Mathf.Sign (semitones) == -1) {
			audio.pitch = 1f + (1f - Mathf.Pow (1.05946f, Mathf.Abs (semitones)));
		} else {
			audio.pitch = Mathf.Pow (1.05946f, Mathf.Abs (semitones));
		}
	}
	
	public function SetPan (pan : float) {
		audio.pan = pan;
	}
	
	public function PlayRandomPitched (range : float) {
		audio.pitch = 1.0 + Random.Range (-range, range);
		Play ();
	}
	
	public function Play () {
		CancelInvoke ("DeactivateIfNotPlaying");
		audio.PlayOneShot (audio.clip);
		Invoke ("DeactivateIfNotPlaying", duration);
	}
	
	public function FadeOut (time : float) {
		FadeOut (time, false);
	}
	
	public function FadeOut (time : float, _stopOnEndFade : boolean) {
		var from : float = (fading) ? fadeVolume : 1.0;
		Fade (from, 0.0, time, _stopOnEndFade);
	}
	
	public function FadeIn (time : float) {
		FadeIn (time, false, false);
	}
	
	public function FadeIn (time : float, play : boolean, loop : boolean) {
		if (!audio.isPlaying && play) {
			if (loop) Loop ();
			else Play ();
		}
		var from : float = (fading) ? fadeVolume : 0.0;
		Fade (from, 1.0, time, false);
	}
	
	public function Fade (from : float, to : float, time : float, _stopOnEndFade : boolean) {
		fromVolume = from;
		toVolume = to;
		fadeTime = time;
		elapsedFadeTime = 0.0;
		stopOnEndFade = _stopOnEndFade;
		if (!fading) {
			StartCoroutine (CoFade ());
			fading = true;
		}
	}
	
	private function CoFade () {
		
		while (elapsedFadeTime < fadeTime) {
			elapsedFadeTime += Time.deltaTime;
			fadeVolume = Mathf.Lerp (fromVolume, toVolume, elapsedFadeTime / fadeTime);
			OnFade (volume);
			yield;
		}
		
		fading = false;
		OnEndFade ();
	}
	
	public function OnFade (f : float) {
		audio.volume = fadeVolume * Volume;
	}
	
	public function OnEndFade () {
		if (stopOnEndFade) {
			audio.Stop ();
			gameObject.SetActiveRecursively (false);
		}
	}
	
	function DeactivateIfNotPlaying () {
		if (audio.isPlaying) Invoke ("DeactivateIfNotPlaying", duration);
		else gameObject.SetActiveRecursively (false);
	}
}