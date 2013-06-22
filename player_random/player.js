module.exports.getTurn = function(grid) {
	if(grid.hasEnded()) {
		console.log("Error; game has ended");
		process.exit(1);
	}

	var free = grid.getFreeSpaces();
	var random = Math.random() * free.length | 0;

	return free[random];
}