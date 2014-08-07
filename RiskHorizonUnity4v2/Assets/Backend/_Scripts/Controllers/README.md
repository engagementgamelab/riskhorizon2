The GameController creates almost all other controllers, and all controllers listen to/talk to the GameController. So, for example, when a level starts, the GameController notifies all the controllers. When a shock hits, it notifies the GameController and the GameController relays the message to the other controllers. Basically, none of the controllers know anything about each other, and the GameController knows everything.

GameState keeps track of what the player is doing in the game (protecting, researching, etc.) This allows us to disable/enable certain actions depending on what the player is doing.

<ul>
<li>DevelopmentController keeps track of the development (this value is displayed in the development bar in the GUI). It also sets goals and checks at the end of the level to see if the goal was met.</li>
<li>EarlyWarningController handles the minigame. It keeps track of how long to show the minigame, and plays the cutscene at the end.</li>
<li>InsuranceController sets insurance plan costs and coverages.</li>
<li>KnowledgeController doesn't do anything anymore. :(</li>
<li>LevelController keeps track of what level we're on.</li>
<li>ProtectionController sets protection rate and cost, and adds to the protection % (triggered by pressing the protection slider in the GUI).</li>
<li>TimeController sets the duration of a level, handles pausing, and the rate of time passing.</li>
<li>Objects in the game that are affected by a changing time scale extend TimeScalable. This means that e.g. when the player pauses the game, the sky will stop spinning.</li>
<li>WealthController keeps track of the wealth (sorry if this is unintuitive). Adds an 'income' every 5 seconds based on the number of growers created and their upgrade levels.</li>
</ul>
