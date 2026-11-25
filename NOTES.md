# LANTERN LANE: Saigon Night-Market Kitchen

Original street-food stall. Top-down 1024×640 canvas, no build, no network.

## Stations (walk-up, E/Space or click)

Back counter crates: noodles, beef, herbs, lime, chili, baguette, pork, pickle.
Left crates: rice paper, shrimp, coffee, condensed milk, ice.
Chop board: hold E, progress ring, herb bits. Knife upgrade shortens the chop.
Broth pot: start a batch, cook ring, ladle when ready, burns if left.
Charcoal grill: pork, flip inside the gold window or it burns.
Assembly counter: first item picks the dish; layers stack; tag shows n/m.
Pass window: drop a finished plate, it glows READY, E serves a matching ticket.
Sink: trash the held item, the assembly, or a wrong plate.

Chef: WASD/arrows, or click a station to walk there. One item in hand. Mouse drag from a crate onto chop, grill, or assembly also works.

## Recipes (combine, not a single list)

- Pho bowl: noodles + broth + beef + chopped herbs. Orders may add lime and/or chili.
- Banh mi: baguette + grilled pork + chopped pickle + herbs + chili.
- Goi cuon: rice paper + shrimp + chopped herbs + noodles.
- Iced milk coffee: coffee + condensed milk + ice.

A ticket ticks ingredients as they land on the matching assembly. Wrong prep floats a hint (CHOP FIRST, FLIP IT, NOT YET).

## Scoring and pressure

Price plus a patience tip, VIP bonus, and a rush combo if you serve again before the combo timer dies. RUSH xN floats at 3+. Three angry walk-offs end the night. Burns reset the combo. Stars: half quota 1, quota 2, quota with no burns and no walk-offs 3. Letter grade from stars across six nights.

## Nights

1 Quiet Alley (pho, coffee) · 2 After Work (+banh mi) · 3 Weekend Glow (+goi cuon) · 4 Festival Rush · 5 Lantern Parade · 6 Full Moon Feast.
Each night: shorter patience, faster spawns, more tickets, more VIP extras. Lantern clock is the service window. Between nights: stall shop (keen knife, second pot, helper cat Miso, tip jar) and the recipe book. Title, pause (P), results, victory, game over. M mutes synthesized chop, sizzle, ding, cash, and a short loop.

## Files

config.js layout and nights · ingredients.js · recipes.js · stations.js · chef.js · input.js · orders.js · customers.js · plating.js · scoring.js · nights.js · shop.js · audio.js · particles.js · render-kitchen.js · render-food.js · render-hud.js · render-screens.js · shots.js · game.js step · main.js screens.

## Screenshot scenes (?shot=&seed=1)

- service: night 4 mid-rush, 5 tickets, crates, pho 3/5, chef chopping, pot ring, READY plate, timer, money, side window, +$12 TIP, RUSH x3, key bar.
- title: logo, how to play, recipe cards, night select, PLAY.
- shop: NIGHT 3 CLEARED, stars, upgrade cards, recipe book, CONTINUE.
- results: victory grade, stats, feats, PLAY AGAIN.
