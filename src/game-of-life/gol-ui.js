var golComponent;
var golComponent2;

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
		livings: getAcorn()
	};



	golComponent = new gol.GameOfLifeComponent(conf);

	/*
	conf.containerId = 'game-of-life-2';
	golComponent2 = new gol.GameOfLifeComponent(conf);
	*/

});

let loc = (x,y) => new gol.Location(x,y);

function getAcorn() {
	return [
			loc(0,1),
			loc(1,3),
			loc(2,0),
			loc(2,1),
			loc(2,4),
			loc(2,5),
			loc(2,6),
		];
}