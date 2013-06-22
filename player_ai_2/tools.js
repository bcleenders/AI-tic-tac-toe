var trained_scores = [],
	trained_counts = [];

module.exports = function(ts, tc) {
	trained_scores = ts;
	trained_counts = tc;
	return module.exports;
}

// Chances on true decrease for high counts.
module.exports.go_random = function(count) {
	return Math.random() < Math.pow( (1/ (1+count)), 0.05);
}

module.exports.alpha = function(count) {
	return (1/ (1+count));
}

module.exports.shuffle = function(array) {
	for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

module.exports.getRandom = function(grid) {
	var free = grid.getFreeSpaces();	
	var random = Math.random() * free.length | 0;

	return free[random];
}

module.exports.getStateIfMarked = function(move, grid, id) {
	grid.set(move, 0);
	var r = grid.getState();
	grid.set(move, -1);
	return r;
}

// Simulate a move, do some calculations and do a rollback
module.exports.simulate = function(move, grid, f) {
	grid.set(move, 0);
	var r = f(grid);
	grid.set(move, -1);
	return r;
}

module.exports.grid2state = function(grid) {
	return grid.getState();
}

module.exports.selectHighestScore = function(moves, grid, scores) {
	moves = this.shuffle(moves);

	var move = moves[0];
	var state = this.getStateIfMarked(moves[0], grid, 1);

	for(var i = 1; i < moves.length; i++) {
		var other_state = this.getStateIfMarked(moves[i], grid, 1);
		if(scores[state] < scores[other_state]) {
			move = moves[i];
			state = other_state;

			// This should give some results...
			if(scores[other_state] > 0 && scores[other_state] < 1)
				console.log('positive score; ' + scores[other_state]);
		}
	}

	return move;
}

module.exports.getEstimateScore = function(grid, id) {
	var moves = grid.getFreeSpaces();

	moves = this.shuffle(moves);
	
	var low_score = 0;
	var low_move = moves[0];

	for(i in moves) {
		var state = this.getStateIfMarked(moves[i], grid, id);

		if(trained_scores[state] != undefined)
			console.log("Not undefined train score");

		if(trained_scores[state] > low_score) {
			low_score = trained_scores[state];
		}
	}

	if(low_score != 0)
		console.log("low_score" + low_score);
	return low_score;
}