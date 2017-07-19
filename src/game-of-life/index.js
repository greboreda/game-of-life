class GameOfLifeComponent {

	constructor(conf) {

		this.game = new gol.GameOfLife({
			rows: conf.rows,
			cols: conf.cols,
			locationsWithLivingCell: conf.livings
		});

		this.grid = new Grid({
			containerId: conf.containerId,
			width: conf.width,
			height: conf.height,
			rows: conf.rows,
			cols: conf.cols,
			backgroundColor: 'black'
		});

		this.period = conf.period;
		this._updateGrid();

		$('#' + conf.containerId).on('gridClick', function(e, obj) {
			var location = new Location(obj.coords.x, obj.coords.y);
			this._toggleLivingCell(location);

		}.bind(this)); 
	}

	_toggleLivingCell(location) {
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
		for(var i=0 ; i<this.game.livings.length ; i++) {
			var location = this.game.livings[i];
			this.grid.changeCellColor(location.x, location.y, 'white');
		}		
	}

}

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

		$canvas.click((function(e) {
			var x = e.pageX - this.canvas.offsetLeft;
			var y = e.pageY - this.canvas.offsetTop;
			var cellY = Math.floor(x / this.cellWidth);
			var cellX = Math.floor(y / this.cellHeight);
			var coords = {x: cellX, y: cellY};
			$('#' + this.containerId).trigger('gridClick', [{coords: coords}]);
		}).bind(this));
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
		this.livings = new LocationSet(config.locationsWithLivingCell).toArray();
		if(this.livings.find(l => !this.world.containsLocation(l))) {
			throw new Error('Invalid configuration: many cells have invalid locations');
		}
	}

	isCellAlive(location) {
		return this.livings.filter(l => l.equals(location)).length > 0;
	}

	iterate() {

		var locationsToEvaluate = new LocationSet();

		this.livings.forEach(function(current) {
			locationsToEvaluate.append(current);
			locationsToEvaluate.appendLocations(this.world.neighboors(current));
		}, this);

		var nextGenLivings = [];

		locationsToEvaluate.toArray().forEach(function(current) {

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
		var set = new LocationSet(this.livings);
		if(set.contains(location)) {
			set.delete(location);
		} else {
			set.append(location);
		}
		return new GameOfLife({
			rows: this.world.rows,
			cols: this.world.cols,
			locationsWithLivingCell: set.toArray()
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

class LocationSet {

	constructor(locations) {
		this.set = [];
		if(locations) {
			for(var i=0 ; i<locations.length ; i++) {
				this.append(locations[i]);
			}
		}
	}

	contains(location) {
		return this.set.filter(l => l.equals(location)).length > 0;
	}

	append(location) {
		if(!this.contains(location)) {
			this.set.push(location);
		}
	}

	delete(location) {
		if(this.contains(location)) {
			var index = this.set.findIndex(function(current) {
				return current.equals(location);
			});
			if(index>-1) {
				this.set.remove(index);
			}
		}
	}

	appendLocations(locations) {
		locations.forEach(function(current) {
			this.append(current);
		}, this);
	}

	toArray() {
		return this.set;
	}

}

module.exports = {
	GameOfLifeComponent: GameOfLifeComponent,
	GameOfLife: GameOfLife,
	World: World,
	Location: Location
};
