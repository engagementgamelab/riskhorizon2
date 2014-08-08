<h2>Sprites</h2>
<ul>
<li>Every sprite in the game extends GameSprite. GameSprite resizes based on the size of the game window.</li>
<li>GameSpriteAnchor is used when you want to position the sprite relative to some position. (Generally if the sprite is not centered on the canvas).</li>
<li>MainCamera is also important for resizing. Most objects in the game are positioned as a percentage of the screen width/height.</li>
</ul>

<h2>Text</h2>
<ul>
<li>FontContainer contains all the fonts used in the game. It also checks to see what size game window we're using (import for mobile devices) and chooses a font set based on that.</li>
<li>All text in the game is a GUIText object, and most extend GameText</li>
</ul>
