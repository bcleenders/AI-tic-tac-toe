var player1 = require('./player_ai/player.js'),
	player2 = require('./player_random/player.js'),
	players = [player1, player2],
	grid = require('./shared/grid.js'),
	curr_player = 0,
	train = true,
	scores = [0,0,0];

var iterations = train ? 25000000 : 1;

player1.init(true, 0)


for(var i = 0; i< iterations; i++) {
	grid.init();

	while(! grid.hasEnded()) {
		var space = players[curr_player].getTurn(grid);
		grid.mark(space, curr_player);
		curr_player = (curr_player + 1) % 2;

		if(! train)
			console.log(space);
	}

	scores[grid.getWinner() + 1]++;

	if(! train)
		console.log(grid.toString())
}

if(typeof player1.saveTrainedData == 'function')
	player1.saveTrainedData();
if(typeof player2.saveTrainedData == 'function')
	player2.saveTrainedData();

console.log("Draws;    " + scores[0]);
console.log("Player 1; " + scores[1]);
console.log("Player 2; " + scores[2]);