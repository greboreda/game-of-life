var golComponent;

$(document).ready(function() {

	golComponent = new gol.GameOfLifeComponent({
		containerId: 'game-of-life',
		width: 800,
		height: 200,
		rows: 10,
		cols: 40,
		period: 100,
		livings: [
			new gol.Location(0,1),
			new gol.Location(1,2),
			new gol.Location(2,0),
			new gol.Location(2,1),
			new gol.Location(2,2)
		]
	});

	golComponent.play()

});

