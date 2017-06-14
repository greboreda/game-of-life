var GOL = require('./GameOfLife.js');
var GameOfLife = GOL.GameOfLife;
var Location = GOL.Location;

let gol = new GameOfLife({
	rows: 10,
	cols: 15,
	locationsWithLivingCell: [
		new Location(0,1),
		new Location(1,2),
		new Location(2,0),
		new Location(2,1),
		new Location(2,2)]
});

function printGol(gol) {
	console.log(gol.repr());
	setTimeout(function() { printGol(gol.iterate()) }, 200);
}

printGol(gol);
