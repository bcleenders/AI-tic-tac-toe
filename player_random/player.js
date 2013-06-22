module.exports.getTurn = function(grid) {
	if(grid.hasEnded()) {
		console.log("Error; game has ended");
		process.exit(1);
	}

	var rand = -1;
	while(rand < 0 || !grid.isFree(rand)) {
		rand = Math.random() * 9 | 0;
	}
	return rand;
}