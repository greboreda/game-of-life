var golComponent;

$(document).ready(function() {

	var conf = {
		containerId: 'game-of-life',
		width: 800,
		height: 600,
		rows: 80,
		cols: 80,
		period: 75,
		cellColor: 'white',
		backgroundColor: 'black',
		livings: getAcorn({x: 37, y:37})
	};

	golComponent = new gol.GameOfLifeComponent(conf);

});

function getAcorn(origin) {
	let xi = origin.x;
	let yi = origin.y;

	let pattern = [ [0,1], [1,3], [2,0], [2,1], [2,4], [2,5], [2,6]];

	return pattern.map(function(c) {
		let x = c[0];
		let y = c[1];
		return new gol.Location(xi+x, yi+y);
	});
}