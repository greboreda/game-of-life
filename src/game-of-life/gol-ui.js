$(document).ready(function() {

	var golConf = {
		containerId: 'game-of-life',
		width: 800,
		height: 400,
		rows: 200,
		cols: 400,
		livings: [
			new gol.Location(0,1),
			new gol.Location(1,2),
			new gol.Location(2,0),
			new gol.Location(2,1),
			new gol.Location(2,2)
		]
	};

	gameOfLifeManager.init(golConf);
	gameOfLifeManager.start();
});

var gameOfLifeManager = (function() {

	var game, grid;

	function init(conf) {

		game = new gol.GameOfLife({
			rows: conf.rows,
			cols: conf.cols,
			locationsWithLivingCell: conf.livings
		});

		var gridConf = {
			containerId: conf.containerId,
			width: conf.width,
			height: conf.height,
			rows: conf.rows,
			cols: conf.cols,
			backgroundColor: 'black'
		};

		grid = new Grid(gridConf);
	}

	function start() {

		var updateGridWithLivings = function() {
			grid.clean();
			for(var i=0 ; i<game.livings.length ; i++) {
				var location = game.livings[i];
				grid.changeCellColor(location.x, location.y, 'white');
			}		
		}

		updateGridWithLivings();
		var loop = function() {
			setTimeout(function() {
				game = game.iterate();
				updateGridWithLivings();
				loop();
			}, 100);
		}
		loop();
	}

	return {
		init: init,
		start: start
	};

})();


class Grid {

	constructor(conf) {
		
		this.containerId = conf.containerId;
		this.width = conf.width;
		this.height = conf.height;
		this.rows = conf.rows;
		this.cols = conf.cols;
		this.backgroundColor = conf.backgroundColor;

		this.cellWidth = this.width/this.cols;
		this.cellHeight = this.height/this.rows;

		var $canvas = $('<canvas/>')
			.attr({width: this.width, height: this.height})
			.appendTo('#' + this.containerId);

		this.canvas = $canvas.get(0);
		this.canvasCtx = this.canvas.getContext("2d");

		this.clean();

	}

	changeCellColor(x, y, color) {

		var startY = x*this.cellHeight;
		var startX = y*this.cellWidth;

		this.canvasCtx.fillStyle = color;
		this.canvasCtx.fillRect(startX, startY, this.cellWidth, this.cellHeight);
		this.canvasCtx.fillStyle = this.backgroundColor;

	}

	clean() {
		this.canvasCtx.fillStyle = this.backgroundColor;
		this.canvasCtx.fillRect(0, 0, this.width, this.height);		
	}

}