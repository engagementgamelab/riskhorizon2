#pragma strict

class TutorialText extends System.Object {
	
	private var guiText : GUIText;
	private var formatter : StringFormatter;
	
	function TutorialText (_guiText : GUIText) {
		guiText = _guiText;
		formatter = new StringFormatter ();
	}
	
	public var id : String[] = [ 
		"Welcome",
		"Interface",
		"Telescope",
		"Development",
		"Insurance",
		"Protection",
		"Early Warning",
		"Knowledge",
		"Shock Hit",
		"Damaged"
	];
	
	private var text : String[] = [
		"\n\nGreetings Luminator! You have been tasked to develop a new community on the beautiful world of Alora. To do so, you must build and upgrade Alorian pods to increase the rate of development and meet our development goals." +
			"\t\nBut this world is not without risks. Comets will strike the planet and cause mighty floods. To succeed, you must forge a balance between healthy development and risk management in order to build a flourishing community." +
			"\n\nRemember to keep your eyes on the horizon. Good luck!",
		
		"Oh. I’m speaking too much Alorian lingo. You are currently looking through an Alorian interface monitor that lets you see the overview of our new community. See that timer on the bottom of your interface? That indicates how much time you have to reach your development goal. That bar on the left side of your screen shows your progress. Development needs to meet or exceed the line I've marked on the bar! By developing more grower pods, our rate of development will increase! If we meet that goal, we will get move onto the next sky cycle, which, if you weren't paying attention to your luminator training, just means we will have another round of work! Notice the colors! Green means good progress and red means our community is not developing quickly enough. The closer the color is to green the better we are doing. If your bar and your growers turn red, you might be in need of some fixing or you are taking actions that hault your development. Lastly, remember, you can't make anything grow without the resources! Everything costs something, so be wary of what you invest in. The Alorian committee will provide you with more resources as the days pass.",
		"When these comets hit, they create mighty floods that will damage our pods and hinder our development. Each comet has a predicted severity and chance of hit. The longer you research a comet, the more accurate these predictions become. Research also grants early warning time which allows you to make last minute preparations to protect your community.",
		"This is your development goal. By building and upgrading Alorian pods, your meter will fill faster, allowing you to reach your goal before time runs out. Upgrade your pods to increase your development rate even faster! But remember, everything costs resources.",
		"Alora is home to a robust market for insurance to help communities rebuild after comets strike. You can purchase any of these three plans. You'll pay the listed cost upfront, but then receive added funding when you need to rebuild damaged structures.",
		"Alora is flourishing, but our communities are in constant danger of waves brought on by comet strikes. If you think a comet is coming, it's a good idea to protect the community. We've placed hydraulic lifts in the ground that can move your pods out of danger, but using the lifts costs resources and slows development. Activate protection by pressing the lever!",
		"A shock is imminent! Because of the early warning technology we developed to deal with these shocks, we have the ability to slow down time by converting the energy gathered from the cosmic magnifier. In this time, we can make last minute preparations to brace our community from an incoming wave. When your early warning time kicks in, your monitor will allow you to rally our alorians around the community, making connections with each other in order to amplify our protection from the wave. The more connections you can make, the more our protection will be multiplied. Remember, these connections won't help without adequate long time preparation! It only multipies your current protection. Click on the glowing Alorian, then drag your mouse to the next glowing Alorian to make a connection. Once all the Alorians on screen are linked, another set will pop up. Keep connecting until your time runs out. Once the energy for early warning time is consumed and your monitor timer reaches zero, the normal time clock will resume.",
		"The more we study these dangerous comets, the more we understand the threats they pose. By focussing on any one comet, you can unlock early warning time should that comet strike Alora. This early warning time can be used to better prepare the community against damage, but it takes quite some time to carefully study these comets, so you must decide whether you invest in early warning time or not.",
		"\n\n\nQuick! Create community connections to boost protection! Click and drag to connect the highlighted pods.",
		"\n\n\nSeems like the flood damaged our pods. Damaged pods don't increase development as quickly. Click on pods to repair."
	];
	
	private var positions : Vector2[] = [
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0),
		new Vector2 (0.0, 0.0)
	];
	
	public function GetText (_id : String) : String[] {
		return formatter.GetSplitText (text[GetIndex (_id)], guiText);
	}
	
	public function GetPosition (_id : String) : Vector2 {
		return positions[GetIndex(_id)];
	}
	
	private function GetIndex (_id : String) : int {
		for (var i = 0; i < id.Length; i ++) {
			if (id[i] == _id) {
				return i;
			}
		}
		return 0;
	}
	
	class StringFormatter extends System.Object {
		
		// To force a new textbox use "\n\t"
		
		private var lineLength : float = 0.0;
		private var maxLines : int = 9;
		
		public function GetSplitText (text : String, gText : GUIText) : String[] {
			
			lineLength = 0.0;//MainCamera.GetDefaultHeight () * 1.45;
			
			var wrappedText = WrapString (text, gText);
			var chars : char[] = wrappedText.ToCharArray ();
			var newlineCount : int = 0;
			var t : String[] = new String[1];
			var messageCount : int = 0;
			
			t[0] = chars[0].ToString ();
			for (var i = 1; i < wrappedText.Length; i ++) {
				if (chars[i].ToString () == "\t") {
					messageCount ++;
					t = AppendArray (t, "");
					continue;
				}
				if (chars[i].ToString () == "\n") {
					newlineCount ++;
					if (newlineCount - (maxLines * messageCount) > maxLines) {
						messageCount ++;
						t = AppendArray (t, "");
					} else {
						t[messageCount] += chars[i].ToString ();
					}
				} else {
					t[messageCount] += chars[i].ToString ();
				}
			}
			return t;
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
}