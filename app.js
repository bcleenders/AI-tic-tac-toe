var player1 = require('./player_ai/player.js'),
	player2 = require('./player_dumb/player.js'),
	players = [player1, player2],
	gameKeeper = require('./gameKeeper.js'),
	scores = [0,0,0],
	scores_log = [];

var iterations = 100000;
var keep_training_results = false;

console.log("  total  | draws |   won    |  lost  | % won")

for(var i = 1; i <= iterations; i++) {
	var result = gameKeeper.run(player1, player2, 0);
	scores[result + 1]++;

	if(i%1000 == 0 || (i<=250 && i%10 == 0) || (i < 15)) {
		var percentWon = Math.round( 100*scores[1]/i, 0) | 0;
		console.log(i2s(i, 8) + " | " + i2s(scores[0], 5) + " | " + i2s(scores[1], 8) + " | " + i2s(scores[2], 6) + " | " + percentWon + "%");
	}
}

function i2s(int, length) {
	return String("        " + int).slice(-length);
}

var total = scores[0] + scores[1] + scores[2];
console.log("Draws;    " + scores[0] + " " + ((100 * scores[0]/total) + 0.5 | 0) + "%");
console.log("Player 1; " + scores[1] + " " + ((100 * scores[1]/total) + 0.5 | 0) + "%  ");
console.log("Player 2; " + scores[2] + " " + ((100 * scores[2]/total) + 0.5 | 0) + "%  ");


if(keep_training_results)
	gameKeeper.saveIntelligence();