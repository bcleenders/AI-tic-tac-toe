var fs = require('fs'),
	file = "ai_training_data.dump",
	trained_scores = [],
	trained_counts = [],
	tools = require('./tools.js')(trained_scores, trained_counts),
	count = 0,
	prev_state = -1;

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

module.exports.getTurn = function(grid, id) {
	if(id == 1)
		grid.invert();
	// From now on, let's suppose that we are player 0.

	// Think of what move we should do
	var move;
	if(tools.go_random(count))
		move = tools.getRandom(grid);
	else
		move = pi(grid);

	tools.simulate(move, grid, function(new_grid) {
		var new_state = tools.grid2state(new_grid);
		var winning = (new_grid.getWinner() == 0);
		if(prev_state >= 0)
			evaluate(prev_state, new_state, winning);
		prev_state = new_state;
	});
	
	// Do a rollback
	if(id == 1)
		grid.invert();

	// Count this advise
	count++;

	// Return our desired move
	return move;
}

// Strategy
function pi(grid) {
	var moves = grid.getFreeSpaces();
	return tools.selectHighestScore(moves, grid, trained_scores);
}

// Utility function
function U(state) {
	var score = trained_scores[state];
	if(score == undefined)
		return 0;
	return score;
}

// Number of times we visited the state
function N(state) {
	var count = trained_counts[state];
	if(count == undefined)
		return 0;
	return count;
}

function evaluate(old_state, new_state, winning) {
	var gamma = 0.9;

	if(winning)
		trained_scores[new_state] = 1;

	var old_score = U(old_state);
	var new_score = U(new_state);

	trained_counts[old_state] = N(old_state) + 1;
	alpha1 = tools.alpha(N(old_state));
	var old_score = old_score + alpha1*(gamma*new_score - old_score);
	trained_scores[old_state] = old_score;
}

module.exports.punish = function(id) {
	trained_scores[prev_state] = -1;
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