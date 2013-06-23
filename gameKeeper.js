var player1 = require('./player_ai/player.js'),
	player2 = require('./player_dumb/player.js'),
	players = [player1, player2],
	grid = require('./shared/grid.js'),
	starting_player = 1,
	curr_player = starting_player,
	scores = [0,0,0];

var iterations = 50000;

console.log("Running " + iterations + " training samples");

for(var i = 0; i< iterations; i++) {

	grid.init();
	curr_player = starting_player;

	while(! grid.hasEnded()) {
		var space = players[curr_player].getTurn(grid, curr_player);
		grid.mark(space, curr_player);
		curr_player = 1 - curr_player;
	}

	if(grid.getWinner() != 0 && typeof player1.punish == 'function') 
		player1.punish(grid, 0);

	if(grid.getWinner() != 1 && typeof player2.punish == 'function') 
		player2.punish(grid, 1);


	scores[grid.getWinner() + 1]++;
}

var total = scores[0] + scores[1] + scores[2];
console.log("Draws;    " + scores[0] + " " + ((100 * scores[0]/total) + 0.5 | 0) + "%");
console.log("Player 1; " + scores[1] + " " + ((100 * scores[1]/total) + 0.5 | 0) + "%  " + (starting_player == 0 ? " (starting)" : ""));
console.log("Player 2; " + scores[2] + " " + ((100 * scores[2]/total) + 0.5 | 0) + "%  " + (starting_player == 1 ? " (starting)" : ""));

if(false) {
	if(typeof player1.save == 'function') 
		player1.save();
	if(typeof player2.punish == 'function') 
		player2.save();
}