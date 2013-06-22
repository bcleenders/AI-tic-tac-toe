var grid = [];

module.exports.init = function() {
	grid = [
		-1,-1,-1,
		-1,-1,-1,
		-1,-1,-1
	];

	return this;
}

module.exports.toString = function() {
	return (  grid[0]+" "+grid[1]+" "+grid[2]+"\n"
			+ grid[3]+" "+grid[4]+" "+grid[5]+"\n"
			+ grid[6]+" "+grid[7]+" "+grid[8]+"\n").replace(/-1/g, " ");
}

module.exports.isFree = function(space) {
	return grid[space] == -1
}

module.exports.getFreeSpaces = function() {
	var freeSpaces = [];
	for(var i = 0; i < grid.length; i++) {
		if(this.isFree(i))
			freeSpaces[freeSpaces.length] = i;
	}
	return freeSpaces;
}

module.exports.mark = function(space, player) {
	if(this.isFree(space))
		grid[space] = player;
	else
		console.log('Error; invalid move');
}

module.exports.set = function(space, value) {
	if(grid[space] != -1 && value != -1) {
		console.log("Invalid set!");
		process.exit(1);
	}
	grid[space] = value;
}

module.exports.hasEnded = function() {
	if(this.getWinner() > -1)
		return true;

	return this.getFreeSpaces().length == 0;
}

function checkForWinner(space1, space2, space3) {
	if(grid[space1] == grid[space2] && grid[space2] == grid[space3])
		return grid[space1]
	else
		return -1
}

var winningCombinations = [
	[0,1,2], [3,4,5], [6,7,8],
	[0,3,6], [1,4,7], [2,5,8],
	[0,4,8], [2,4,6]
];

module.exports.getWinner = function() {
	for(var i = 0; i < winningCombinations.length; i++) {
		var entry = winningCombinations[i];
		var winner = checkForWinner(entry[0], entry[1], entry[2]);
		if(winner > -1)
			return winner;
	}
	return -1;
}

module.exports.getState = function() {
	var state = 0;
	for(var i = 0; i < grid.length; i++)
		if(grid[i] >= 0)
			state += (grid[i] + 1) * Math.pow(3, i);
	
	return state;
}

module.exports.invert = function() {
	for(var i = 0; i < 9; i++)
		if(grid[i] >= 0)
			grid[i] = 1 - grid[i];
}