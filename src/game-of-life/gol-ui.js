var golComponent;

var loc = (x,y) => new gol.Location(x,y);

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
		livings: getAcorn(loc(37,37))
	};

	golComponent = new gol.GameOfLifeComponent(conf);

});

function getAcorn(origin) {
	let pattern = [ loc(0,1), loc(1,3), loc(2,0), loc(2,1), loc(2,4), loc(2,5), loc(2,6)];
	return pattern.map(c => new gol.Location(origin.x+c.x, origin.y+c.y) );
}