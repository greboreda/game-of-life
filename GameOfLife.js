
class GameOfLife {

	constructor(config) {

		this.world = new World(config.rows, config.cols);
		//TODO maybe can use isCellAlive method
		this.livings = config.locationsWithLivingCell.filter(function(location, index, self) {
			let foundIndex = self.findIndex(function(l) {
				return l.x === location.x && l.y === location.y; 
			});
			return foundIndex === index;
		});
		this.livings.forEach(function(location, index) {
			if(!this.world.containsLocation(location)) {
				throw new Error('Invalid configuration: many cells have invalid locations');
			}
		}, this);
	}

	isCellAlive(location) {
		for(let i=0 ; i<this.livings.length ; i++) {
			let current = this.livings[i];
			if(current.equals(location)) {
				return true;
			}
			return false;
		}
	}

	iterate() {
		let bornCells = [];
		for(let i=0 ; i<this.emptyLocations.length ; i++) {

		}

	}

	repr() {

	}

	get numberLivings() {
		return this.livings.length;
	}

	get emptyLocations() {
		return this.world.allLocations.filter(function(location) {
			return !this.isCellAlive(location);
		}, this);
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

	get area() {
		return this.rows * this.cols;
	}

	get allLocations() {
		let locations = [];
		for(let i=0 ; i<this.rows ; i++) {
			for(let j=0 ; j<this.cols ; j++) {
				locations.push(new Location(i,j));
			}
		}
		return locations;
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
}


module.exports = {
	GameOfLife: GameOfLife,
	World: World,
	Location: Location
};