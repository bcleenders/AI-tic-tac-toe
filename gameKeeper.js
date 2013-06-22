var player1 = require('./player_random/player.js'),
	player2 = require('./player_random/player.js'),
	players = [player1, player2],
	grid = require('./shared/grid.js'),
	curr_player = 0;

grid.init();

while(! grid.hasEnded()) {
	var space = players[curr_player].getTurn(grid);
	grid.mark(space, curr_player);
	curr_player = (curr_player + 1) % 2;

	console.log(space);
}

if(grid.getWinner() > -1)
	console.log("Player", grid.getWinner(), "has won the match");
else
	console.log("It's a draw...");

console.log(grid.toString());