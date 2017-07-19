var golComponent;
var golComponent2;

$(document).ready(function() {

	var conf = {
		containerId: 'game-of-life',
		width: 800,
		height: 600,
		rows: 80,
		cols: 80,
		period: 100,
		livings: [
			new gol.Location(0,1),
			new gol.Location(1,2),
			new gol.Location(2,0),
			new gol.Location(2,1),
			new gol.Location(2,2)
		]
	};

	golComponent = new gol.GameOfLifeComponent(conf);
	golComponent.play()

	/*
	conf.containerId = 'game-of-life-2';
	golComponent2 = new gol.GameOfLifeComponent(conf);
	golComponent2.play();
	*/


});

