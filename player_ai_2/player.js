var fs = require('fs'),
	file = "ai_training_data.dump",
	trained_scores = [],
	trained_counts = [],
	tools = require('./tools.js')(trained_scores, trained_counts),
	count = 0;

if(fs.existsSync(file)) {
	var file_contents = fs.readFileSync(file);
	trained_scores = JSON.parse(file_contents).scores;
	trained_counts = JSON.parse(file_contents).counts;

	var c = 0;
	for(i in trained_scores) {
		var n = trained_scores[i];
		if(0 < n && n < 1)
			c++;
	}
	console.log("Starting with " + c + " 0 < nodeValue < 1 nodes");
}

module.exports.getTurn = function(grid, id, test) {
	if(id == 1)
		grid.invert();
	// From now on, let's suppose that we are player 0.

	// Think of what move we should do
	var move;
	if(!test && tools.go_random(count))
		move = tools.getRandom(grid);
	else
		move = get_best_move(grid);

	// The learning step
	evaluate(move, grid);

	// Do a rollback
	if(id == 1)
		grid.invert();

	// Count this advise
	count++;

	// Return our desired move
	return move;
}

function get_best_move(grid) {
	var moves = grid.getFreeSpaces();
	return tools.selectHighestScore(moves, grid, trained_scores);
}

function getScore(state) {
	var score = trained_scores[state];
	if(score == undefined)
		return 0;
	return score;
}

function getCount(state) {
	var count = trained_counts[state];
	if(count == undefined)
		return 0;
	return count;
}

function evaluate(move, grid, id) {
	var old_state = tools.grid2state(grid);
	var new_state = tools.getStateIfMarked(move, grid, 0);

	var winning = tools.simulate(move, grid, function(new_grid) {
		return new_grid.getWinner() == 0;
	});

	// Set reward
	if(winning) {
		trained_scores[new_state] = 1;
		trained_counts[new_state] = 1;
	}
	else {
		
	}

	if(trained_counts[new_state] == undefined) {
		trained_counts[new_state] = 1;
		
		trained_scores[new_state] = tools.simulate(move, grid, function(new_grid) {
			tools.getEstimateScore(new_grid, 1);
		});
	}
	else {
		// Increase count
		trained_counts[old_state] = getCount(old_state);

		var old_score = getScore(old_state);
		var new_score = getScore(new_state);

		var learning_factor = tools.alpha(getCount(old_state));
		var gamma = 0.9;

		var updated_score = old_score + learning_factor*(gamma*new_score - old_score);
		if(updated_score == undefined || updated_score == NaN)
			console.log("Error in player evaluate function!");
		trained_scores[old_state] = updated_score;

		if(updated_score != gamma)
			console.log("u.s. " + trained_scores[old_state]);
	}
}

module.exports.punish = function(grid, id) {
	if(id == 1)
		grid.invert();

	var state = tools.grid2state(grid);
	//trained_scores[state] = -1;

	if(id == 1)
		grid.invert();
}

module.exports.save = function() {
	var train_data = {
		scores: trained_scores,
		counts: trained_counts
	};
	// write training data to file
	fs.writeFileSync(file, JSON.stringify(train_data));
	console.log("Saved trained data to " + file + ".\n");
}