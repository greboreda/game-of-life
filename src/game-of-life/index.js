class GameOfLifeComponent {

	constructor(conf) {

		this.game = new gol.GameOfLife({
			rows: conf.rows,
			cols: conf.cols,
			locationsWithLivingCell: conf.livings
		});

		var $golContainer = $('<div>', {class: 'gol-container'}).appendTo('#' + conf.containerId);

		this.grid = new Grid({
			$container: $golContainer,
			width: conf.width,
			height: conf.height,
			rows: conf.rows,
			cols: conf.cols,
			backgroundColor: conf.backgroundColor
		});

		this.cellColor = conf.cellColor;
		this.period = conf.period;
		this._updateGrid();

		$golContainer.on('gridClick', function(e, obj) {
			var location = new Location(obj.coords.x, obj.coords.y);
			this._toggleCellLife(location);

		}.bind(this));

		$golContainer.append($('<div>', {class: 'gol-buttons'})
			.append($('<button>',
				{
					text: 'play',
					click: function(e) {
						this.play();
					}.bind(this)
				}))
			.append($('<button>',
				{
					text: 'pause',
					click: function(e) {
						this.pause();
					}.bind(this)
				})));
	}

	_toggleCellLife(location) {
		this.game = this.game.toggleLiving(location);
		this._updateGrid();
	}

	play() {
		if(this.intervalId) {
			console.log('game is currently playing!');
			return;
		}

		var iterate = (function() {
			this.game = this.game.iterate();		
			this._updateGrid();
		}).bind(this);

		this.intervalId = setInterval(iterate, this.period);
	}

	pause() {
		if(this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	_updateGrid() {
		this.grid.clean();
		this.game.livings.forEach(l => this.grid.changeCellColor(l.x, l.y, this.cellColor));
	}

}

class Grid {

	constructor(conf) {
		
		this.$container = conf.$container;
		this.width = conf.width;
		this.height = conf.height;
		this.rows = conf.rows;
		this.cols = conf.cols;
		this.backgroundColor = conf.backgroundColor;

		this.cellWidth = this.width/this.cols;
		this.cellHeight = this.height/this.rows;

		var $canvas = $('<canvas/>')
			.attr({width: this.width, height: this.height});

		this.canvas = $canvas.get(0);
		this.canvasCtx = this.canvas.getContext("2d");

		this.clean();

		$canvas.click((function(e) {
			var x = e.pageX - this.canvas.offsetLeft;
			var y = e.pageY - this.canvas.offsetTop;
			var cellY = Math.floor(x / this.cellWidth);
			var cellX = Math.floor(y / this.cellHeight);
			var coords = {x: cellX, y: cellY};
			this.$container.trigger('gridClick', [{coords: coords}]);
		}).bind(this));

		this.$container.append($canvas);
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



class GameOfLife {

	constructor(config) {
		this.world = new World(config.rows, config.cols);
		this.livings = Location.distincts(config.locationsWithLivingCell);
		if(this.livings.find(l => !this.world.containsLocation(l))) {
			throw new Error('Invalid configuration: many cells have invalid locations');
		}
	}

	isCellAlive(location) {
		return this.livings.find(l => l.equals(location)) !== undefined;
	}

	iterate() {

		var locationsToEvaluate = [];

		this.livings.forEach(function(current) {
			locationsToEvaluate.push(current);
			locationsToEvaluate = locationsToEvaluate.concat(this.world.neighboors(current));
		}, this);

		locationsToEvaluate = Location.distincts(locationsToEvaluate);

		var nextGenLivings = [];

		locationsToEvaluate.forEach(function(current) {

			let isAlive = this.isCellAlive(current);
			let aliveNeighboors = this.world.neighboors(current).filter(l => this.isCellAlive(l));

			if(!isAlive && aliveNeighboors.length === 3) {
				nextGenLivings.push(current);
			} else if(isAlive && (aliveNeighboors.length === 2 || aliveNeighboors.length === 3)) {
				nextGenLivings.push(current);
			}

		}, this);

		return new GameOfLife({
			rows: this.world.rows,
			cols: this.world.cols,
			locationsWithLivingCell: nextGenLivings
		});
	}

	toggleLiving(location) {

		let cellIndex = this.livings.findIndex(l=>l.equals(location));
		if(cellIndex !== -1) {
			this.livings.splice(cellIndex, 1);
		} else {
			this.livings.push(location);
		}

		return new GameOfLife({
			rows: this.world.rows,
			cols: this.world.cols,
			locationsWithLivingCell: this.livings
		});
	}

	get numberLivings() {
		return this.livings.length;
	}
}

class World {

	constructor(rows, cols) {
		if(rows<1 || cols<1) {
			throw new Error('Invalid dimensions');
		}
		this.rows = rows;
		this.cols = cols;
	}

	containsLocation(location) {
		let hasValidRow = location => location.x >= 0 && location.x < this.rows;
		let hasValidCol = location => location.y >= 0 && location.y < this.cols;
		return hasValidRow(location) && hasValidCol(location);
	}

	convertLocation(location) {
		let rem = (n,M) => ((n % M) + M) % M;
		let newX = rem(location.x, this.rows);
		let newY = rem(location.y, this.cols);
		return new Location(newX, newY);
	}

	convertLocations(locations) {
		return locations.map( l => this.convertLocation(l) );
	}

	neighboors(location) {
		let converted = this.convertLocation(location);
		return this.convertLocations(converted.neighboors);
	}

}

class Location {
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equals(another) {
		return this.x === another.x && this.y === another.y;
	}

	serialize() {
		return this.x + ',' + this.y;
	}

	static deserialize(locationString) {
		let parts = locationString.split(',');
		let x = Number(parts[0]);
		let y = Number(parts[1]);
		return new Location(x, y);
	}


	static distincts(locations) {
		let set = new Set( locations.map(l => l.serialize()) );
		return Array.from(set, e => Location.deserialize(e) );
	}

	get neighboors() {
		let factors = [
			{dx: 1, dy: 1},
			{dx: 0, dy: 1},
			{dx: 1, dy: 0},
			{dx:-1, dy:-1},
			{dx:-1, dy: 0},
			{dx: 0, dy:-1},
			{dx:-1, dy: 1},
			{dx: 1, dy:-1}
		]

		return factors.map(function(factor) {
			let newX = this.x + factor.dx;
			let newY = this.y + factor.dy;
			return new Location(newX, newY);
		}, this);
	}

	toString() {
		return '{ x: ' + this.x + ', y: ' + this.y + ' }';
	}
}

module.exports = {
	GameOfLifeComponent: GameOfLifeComponent,
	GameOfLife: GameOfLife,
	World: World,
	Location: Location
};
