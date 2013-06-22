module.exports.getTurn = function(grid) {
	if(grid.hasEnded()) {
		console.log("Error; game has ended");
		process.exit(1);
	}

	for(var i = 0; i < 9; i++) {
		if(grid.isFree(i))
			return i;
	}
}