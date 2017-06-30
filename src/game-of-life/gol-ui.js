$(document).ready(function() {

	var golConf = {
		containerId: 'game-of-life',
		width: 400,
		height: 200,
		rows: 10,
		cols: 20
	}

	gameOfLifeManager.init(golConf);
});

var gameOfLifeManager = (function() {

	var game = new gol.GameOfLife({
                        rows: 1,
                        cols: 1,
                        locationsWithLivingCell: []
                });

	function init(conf) {
		initGrid(conf.containerId, conf.width, conf.height, conf.rows, conf.cols);
	}

	function initGrid(containerId, width, height, rows, cols) {
		var gridConf = {
			containerId: containerId,
			width: width,
			height: height,
			rows: rows,
			cols: cols,
			backgroundColor: 'black'
		};

		var grid = new Grid(gridConf);

		grid.changeCellColor(2,2,'white');

	}

	return {
		init: init
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

		this.canvasCtx.fillStyle = this.backgroundColor;
		this.canvasCtx.fillRect(0, 0, this.width, this.height);

	}

	changeCellColor(x, y, color) {

		var startX = x*this.cellHeight;
		var startY = y*this.cellWidth;

		this.canvasCtx.fillStyle = color;
		this.canvasCtx.fillRect(startX, startY, this.cellWidth, this.cellHeight);
		this.canvasCtx.fillStyle = this.backgroundColor;

	}

}