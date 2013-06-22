var fs = require('fs'),
	file = "./ai_trained.dump",
	trained_scores = [],
	trained_counts = [],
	train,
	player_id,
	previous_new_state = -1,
	move_count = 0;

module.exports.init = function(in_train_mode, id) {
	// load training data from file
	train = in_train_mode;

	if(train)
		console.log("AI player running in train mode");

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

function decide_best_vs_random() {
	return 1 - 1/(move_count + 1);
}

function evaluate(move, old_grid) {
	// Get some state info, and revert to the old grid
	var old_state = grid2state(old_grid);
	old_grid.set(move, player_id);
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

module.exports.punish = function() {
	if(previous_new_state > -1)
		trained_scores[previous_new_state] = -1;
}

function alpha(count) {
	return 1/(1+count);
}

function get_best_move(grid) {
	var empty_fields = grid.getFreeSpaces();

	// Shuffle the array
	for (var i = empty_fields.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = empty_fields[i];
        empty_fields[i] = empty_fields[j];
        empty_fields[j] = temp;
    }

	// Initialize the first iteration
	var curr_highest = -1;
	var curr_score = -1;

	for(var i = 0; i < empty_fields.length; i++) {
		grid.set(empty_fields[i], player_id);

		var state = grid2state(grid);
		if(trained_scores[state] > curr_score || curr_highest == -1) {
			curr_highest = empty_fields[i];
			curr_score = trained_scores[state];
		}

		// Return to previous state
		grid.set(empty_fields[i], -1);
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
	var to_add = 1 - player_id;

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
	console.log("Saved trained data to " + file + ".\n");
}