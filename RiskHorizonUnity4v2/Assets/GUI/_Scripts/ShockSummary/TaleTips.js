#pragma strict

class TaleTips extends System.Object {
	
	private var lineLength : float = 0.0;
	
	private var title : String = "Tales From the Alorian Insurance Salesman";
	
	private var tips : String[] = [
		"Did you know that you are the 151st Illuminator? There's a long line of great community builders behind you, and you stand on all of their shoulders! So make sure you meet those development goals. Your legacy is at stake!",
		"Alorans pride themselves on efficiency and the beauty of design, so you should always be doing something! While your pods are developing, you could protect, or research incoming comets.",
		"Did you know? Protecting the community is useful, but can get expensive. The higher the community rises, the more expensive it becomes to raise it further. Diminishing returns are a fact of life here.",
		"Did you know that even a little bit of protection goes a long way? Even if your pods are damaged, they'll be damaged less if you're protected. This makes them easier to repair.",
		"When a shock is imminent, it might be too late to protect or buy insurance, but you can still make community connections. By researching incoming comets, you will have more time to connect your pods, raising your protection level!",
		"Did you know that the primary threat to Alora is comets? On other worlds there are many kinds of shocks: Floods, famine, drought, economic collapse, or even relatively small household shocks like losing a job.",
		"With our planet's advanced technology, we can lift an entire community up and out of a flood's path! On other worlds, they put houses on stilts, lay down sandbags, or build dams to protect their homes from flood.",
		"Community connections can help your long term protection and insurance. Connected neighbors and community organizations help one another when a shock comes. That's why we connect our pods when a flood is incoming.",
		"Like most insurance companies, Alorian insurance salesmen force you to renew your plans every round. But if you want to buy a better plan during a round, you can do that at any time.",
		"The 99th Illuminator always saved his resources to develop many pods all at once, but the 130th upgraded buildings as soon as she could. Which method do you think is better?",
		"The Great Council of Alora rewards Illuminators who do well! The more you upgrade your pods, the more resources you will receive.",
		"Hmm… I was thinking: community connections are a type of insurance. When disaster strikes we help each other survive by sharing resources. Forming and sustaining connections is so valuable.",
		"The First Illuminator famously spent her days staring into the night sky. It's beautiful, but full of dangers. If it wasn't for her curiosity, Alora would never have reached this level of development.",
		"Did you know that very dangerous comets sometimes come back to back? It's important to look out for these Duos of Doom, and research, protect, and insure for the worst when you see them coming.",
		"Everything we do has some cost, whether in time or resources. Such is the way of the world, where nothing comes easily. ",
		"Struggling to make community connections before a disaster? Try spending more time on research, especially for more severe comets. The more research, the more time you will have to prepare!",
		"The information we have about comets is not perfect, but the more you research them, the more accurate our information becomes. That's why severity and chance of hit change as you spend more time on research!",
		"The most severe shock possible on Alora is measured at Level 10. Only raising the community to 10 degrees (completely filling the protection bar) can prevent damage from a Level 10 comet.",
		"Did you know that our planet orbits through an enormous stellar nursery, brimming with comets? When comets collide with Alora, they rain down and cause devastating floods. The hard duty of the Illuminator is to usher harmony into this dangerous but beautiful world."
	];
	
	public function TaleTips (_lineLength : float) {
		lineLength = _lineLength;
	}
	
	public function GetRandomTip (gText : GUIText) : String {
		var t : int = Random.Range (0, tips.Length);
		return WrapString (tips[t], gText);
	}
	
	private function WrapString (text : String, gText : GUIText) : String {
	 		
 		gText.text = "";
 		
		var words : String[] = Split (text); //Split the string into seperate words
	    var result : String = "";
	 	var textSize : Rect = gText.GetScreenRect ();
		var numberOfLines = 1;
	 	
		for (var i = 0; i < words.length; i ++) {
	 
			var word = words[i];
			if (i == 0) {
				result = words[0];
				gText.text = result;
			}
			
			if (i > 0 ) {
				result += word;
				gText.text = result;
			}
 
			textSize = gText.GetScreenRect();
			if (textSize.width > lineLength) {
				
				result = result.Substring (0, result.Length - (word.Length));
				result += "\n" + word;
				numberOfLines += 1;
				gText.text = result;
			}
	    }
	    
	    return gText.text;
	}
	
	private function Split (t : String) : String[] {
		var ta : char[] = t.ToCharArray ();
		var output : String[] = new String[1];
		output[0] = ta[0].ToString ();
		for (var i = 1; i < ta.Length; i ++) {
			if (ta[i] == " ") {
				output = AppendArray (output, " ");
				continue;
			}
			output[output.Length - 1] += ta[i].ToString ();
		}
		return output;
	}
	
	private function AppendArray (arr : String[], newVal : String) : String[] {
		var newLength : int = arr.Length + 1;
		var newArr : String[] = new String[newLength];
		for (var i = 0; i < arr.Length; i ++) {
			newArr[i] = arr[i];
		}
		newArr[newLength - 1] = newVal;
		return newArr;
	}
}