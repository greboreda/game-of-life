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
			cols: cols
		};

		var grid = new Grid(gridConf);

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

		var $canvas = $('<canvas/>').attr({width: this.width, height: this.height}).appendTo('#' + this.containerId);

		this.canvas = $canvas.get(0);

		var ctx = this.canvas.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, this.width, this.height);

	}

}