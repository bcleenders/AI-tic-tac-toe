var advisor = require('./advisor.js'),
	train,
	player_id,
	previous_new_state = -1,
	move_count = 0;

module.exports.init = function(in_train_mode, id) {
	// load training data from file
	train = in_train_mode;

	if(train)
		console.log("AI player running in train mode");

	player_id = id;
}

module.exports.getTurn = function(grid) {
	move_count++;
	if(grid.hasEnded()) {
		console.log("Error; game has ended");
		process.exit(1);
	}

	if(train) {
		var move;
		// mix between random moves and a strategy
		if(Math.random() < decide_best_vs_random())
			move = advisor.advise(grid, player_id);
		else
			var free = grid.getFreeSpaces();	
			var random = Math.random() * free.length | 0;
			return free[random];

		advisor.evaluate(move, grid, player_id);
		return move;
	}
	else {
		// only pick the moves that seem best
		return get_best_move(grid);
	}
}

function decide_best_vs_random() {
	return 1 - 1/(move_count + 1);
}

module.exports.saveTrainedData = advisor.saveTrainedData;