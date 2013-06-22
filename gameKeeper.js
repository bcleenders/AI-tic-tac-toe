var player1 = require('./player_ai/player.js'),
	player2 = require('./player_random/player.js'),
	players = [player1, player2],
	grid = require('./shared/grid.js'),
	starting_player = 0,
	curr_player = starting_player,
	train = true,
	scores = [0,0,0];

var iterations = train ? 1000000 : 100;

player1.init(train, starting_player);
	
for(var i = 0; i< iterations; i++) {
	if(i%(iterations / 100) == 0)
		console.log(i + " (" + ((100*i/iterations) | 0) + "%)");

	grid.init();
	curr_player = starting_player;

	while(! grid.hasEnded()) {
		var space = players[curr_player].getTurn(grid);
		grid.mark(space, curr_player);
		curr_player = (curr_player + 1) % 2;
	}

	if(grid.getWinner() != 0 && typeof player1.punish == 'function')
		player1.punish();
	if(grid.getWinner() == 1 && typeof player2.punish == 'function')
		player2.punish();

	scores[grid.getWinner() + 1]++;
}

if(true) {
	if(typeof player1.saveTrainedData == 'function')
		player1.saveTrainedData();
	if(typeof player2.saveTrainedData == 'function')
		player2.saveTrainedData();
}


var total = scores[0] + scores[1] + scores[2];
console.log("Draws;    " + scores[0] + " " + ((100 * scores[0]/total) + 0.5 | 0) + "%");
console.log("Player 1; " + scores[1] + " " + ((100 * scores[1]/total) + 0.5 | 0) + "%");
console.log("Player 2; " + scores[2] + " " + ((100 * scores[2]/total) + 0.5 | 0) + "%");