var fs = require('fs'),
	file = "./ai_trained_scores.dump",
	trained_scores = [],
	trained_counts = [],
	train = false,
	is_player1 = true,
	previous_new_state = -1;

module.exports.init = function(in_train_mode, player_id) {
	// load training data from file
	if(in_train_mode) {
		if(fs.existsSync(file)) {
			var file_contents = fs.readFileSync(file);
			trained_scores = JSON.parse(file_contents).scores;
			trained_counts = JSON.parse(file_contents).counts;
		}

		var c = 0;
		for(var i = 0; i < trained_scores.length; i++)
			if(trained_scores[i] > 0)
				c++;
		console.log("Encountered " + c + " not-null values");
		console.log("There are " + Math.pow(3, 9) + " entries");


		train = true;
	}

	is_player1 = (player_id == 0);
}

module.exports.getTurn = function(grid) {
	if(grid.hasEnded()) {
		console.log("Error; game has ended");
		process.exit(1);
	}

	if(train) {
		var move;
		// mix between random moves and a strategy
		if(Math.random() < 0.9)
			move = get_best_move(grid);
		else
			move = get_random_move(grid);

		evaluate(move, grid);
		return move;
	}
	else {
		// only pick the moves that seem best
		return get_best_move(grid);
	}
}

function evaluate(move, old_grid) {
	// Get some state info, and revert to the old grid
	var old_state = grid2state(old_grid);
	old_grid.set(move, 0);
	var new_state = grid2state(old_grid);
	var winning = (old_grid.getWinner() == 0);
	old_grid.set(move, -1);

	if(winning) {
		trained_scores[new_state] = 1;
		trained_counts[new_state] = 1;
	}

	if(trained_counts[new_state] == undefined) {
		trained_counts[new_state] = 1;
		trained_scores[new_state] = 0;
	}
	else {
		trained_counts[old_state]++;

		var old_score = trained_scores[old_state];
		var new_score = trained_scores[new_state];
		var learning_factor = alpha(trained_counts[old_state]);
		var gamma = 0.8;

		var updated_score = old_score + learning_factor*(gamma*new_score - old_score);
		trained_scores[old_state] = updated_score;
	}

	// Keep this in mind; if we lose, we can decrease the score of this one...
	previous_new_state = new_state;
}

function alpha(count) {
	return 1/(1+count);
}

function get_best_move(grid) {
	var best = get_highest_move(grid);
	if(best > -1)
		return best;
	else
		return get_random_move(grid);
}

// Checks all possibile moves, and selects the best
function get_highest_move(grid) {
	return -1;
	var empty_fields = grid.getFreeSpaces();

	// No training data was available
	if(empty_fields.length == 0)
		return -1;

	// Initialize the first iteration
	var curr_highest = -1;
	var curr_score = -1;

	for(var i = 1; i < empty_fields.length; i++) {
		grid.set(i, 0);
		var state = grid2state(grid);
		if(trained_scores[state] != null && trained_scores[state] > curr_score || curr_highest == -1) {
			curr_highest = i;
			curr_score = trained_scores[state];
		}

		// Return to previous state
		grid.set(i, -1);
	}

	return curr_highest;
}

function get_random_move(grid) {
	var free = grid.getFreeSpaces();
	var random = Math.random() * free.length | 0;

	return free[random];
}

// Returns an id unique for every possible state of the grid.
function grid2state(grid) {
	var state = 0;
	var fields = grid.getFields();

	// Add 1 to invert the perspective, if 
	var to_add = is_player1 ? 0 : 1;

	for(var i = 0; i < fields.length; i++)
		if(fields[i] >= 0)
			state += ((fields[i]+ to_add) % 2 + 1) * Math.pow(3, i);
	
	return state;
}

// Beware; two ai bots running simultaniously will overwrite each others data...
module.exports.saveTrainedData = function() {
	var train_data = {
		scores: trained_scores,
		counts: trained_counts
	};
	// write training data to file
	fs.writeFileSync(file, JSON.stringify(train_data));
	console.log("Saved trained data.\n");
}