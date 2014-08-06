#pragma strict

class Hum extends SoundEffect {
	
	private var rates : float[] = [ 0.1, 0.25, 0.33, 0.5, 0.67, 1.0 ];
	private var pans : float[] = [ 0.0, 0.0, 0.5, 1.0, 0.5, 0.0, -0.5, -1.0, -0.5 ];
	private var pitches : int[] = [ -12, -8, -3, 0, 4, 9, 12, 14, 16 ];
	
	private var amp : float = 0.0;
	private var rate : float = 1.0;
	private var depth : float = 0.45;	// 0.5 = full, 0.0 = none
	private var oscillating : boolean = false;
	
	private var fadeLength : float = 3.0;
	
	public function CreateHum (id : int) {
		Volume = 0.25;
		SetPan (pans[id]);
		SetPitch (pitches[id]);
		rate = rates[0];
	}
	
	public function PlayHum (level : int) {
		rate = rates[level - 1];
		if (!audio.isPlaying || FadeVolume < 1.0) {
			if (!audio.isPlaying) {
				StartOscillating ();
			}
			FadeIn (fadeLength, true, true);
		}
	}
	
	public function StopHum () {
		StopOscillating ();
	}
	
	public function FadeInHum () {
		FadeIn (fadeLength);
	}
	
	public function FadeOutHum () {
		if (FadeVolume > 0.0) FadeOut (fadeLength);
	}
	
	private function StartOscillating () {
		StartCoroutine (CoOscillate ());
	}
	
	private function StopOscillating () {
		FadeOut (fadeLength);
		yield WaitForSeconds (fadeLength);
		oscillating = false;
	}
	
	private function CoOscillate () {
		if (oscillating) return;
		oscillating = true;
		var time : float = 0.0;
		while (oscillating) {
			time += Time.deltaTime * rate;
			amp = 0.5 + (Mathf.Sin (time) * depth);
			OnSetAmp ();
			yield;
		}
	}
	
	public function OnSetAmp () {
		audio.volume = FadeVolume * Volume * amp;
	}
	
	public function OnFade (f : float) {
		audio.volume = FadeVolume * Volume * amp;
	}
}