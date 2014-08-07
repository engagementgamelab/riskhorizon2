<ul>
<li>ShockController creates the shocks. It's also where we've hardcoded the attributes and number of shocks per level.</li>
<li>Shock keeps track of the time it takes to go across the sky, and also holds the shock's attributes.</li>
<li>ShockAttributes holds information about the shock (severity, chance of hitting, research...)</li>
<li>A ShockReport is created every time a shock hits/misses. It records the attributes at the time of hit, as well as general info about the state of the game (e.g. protection %). Shock reports get shown at the end of the level in the ShockSummary screen.</li>
<li>ShockReports contains these reports.</li>
</ul>
