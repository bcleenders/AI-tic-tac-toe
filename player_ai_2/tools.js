var trained_scores = [],
	trained_counts = [];

module.exports = function(ts, tc) {
	trained_scores = ts;
	trained_counts = tc;
	return module.exports;
}

// Chances on true decrease for high counts.
module.exports.go_random = function(count) {
	return Math.random() < 0.1;
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
	return getMinMaxMove(moves, grid, scores, true);
}

module.exports.selectLowestScore = function(moves, grid, scores) {
	return getMinMaxMove(moves, grid, scores, false);
}

function getMinMaxMove(moves, grid, scores, max) {
	moves = module.exports.shuffle(moves);

	var move = moves[0];
	var state = module.exports.getStateIfMarked(moves[0], grid, (max * 1));

	for(var i = 1; i < moves.length; i++) {
		var other_state = module.exports.getStateIfMarked(moves[i], grid, (max * 1));
		if( (scores[state] < scores[other_state] && max) ||
			(scores[state] > scores[other_state] && !max)) {
			move = moves[i];
			state = other_state;
		}
	}

	return move;
}

module.exports.getEstimateScore = function(grid) {
	var moves = grid.getFreeSpaces();

	moves = this.shuffle(moves);
	
	var low_score = 0;
	var low_move = moves[0];

	for(i in moves) {
		// This is the opponents turn;
		var state = this.getStateIfMarked(moves[i], grid, 1);

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