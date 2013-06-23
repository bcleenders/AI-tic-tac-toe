var grid = require('./shared/grid.js');

module.exports.run = function(player1, player2, starting_player) {
	var curr_player = starting_player;
	var players = [player1, player2];

	grid.init();

	// Run the match
	while(! grid.hasEnded()) {
		var space = players[curr_player].getTurn(grid, curr_player);
		grid.mark(space, curr_player);
		curr_player = 1 - curr_player;
	}

	// Punish the loser
	if(grid.getWinner() != 0 && typeof player1.punish == 'function') 
		player1.punish(grid, 0);
	if(grid.getWinner() != 1 && typeof player2.punish == 'function') 
		player2.punish(grid, 1);

	return grid.getWinner();
}

module.exports.saveIntelligence = function() {
	if(typeof player1.save == 'function') 
		player1.save();
	if(typeof player2.punish == 'function') 
		player2.save();
}