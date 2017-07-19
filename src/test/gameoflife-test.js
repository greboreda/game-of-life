var should = require("chai").should();
var GOL = require('../game-of-life/');
var GameOfLife = GOL.GameOfLife;
var Location = GOL.Location;
var World = GOL.World;

describe('Location', function() {

	it('should be equal to another with same x and y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(0, 0);
		location1.should.be.eql(location2);
	});

	it('should not be equal to another with distinct x and same y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(1, 0);
		location1.should.not.be.eql(location2);
	});

	it('should not be equal to another with same x and distinct y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(0, 1);
		location1.should.not.be.eql(location2);
	});

	it('should not be equal to another with distinct x and y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(1, 1);
		location1.should.not.be.eql(location2);
	});

	it('should have eight neighboors', function() {
		new Location(0,0).neighboors.should.be.an('array').that.have.lengthOf(8);
	});

	it('should have north neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(-1,0));
	});

	it('should have south neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(1,0));
	});

	it('should have east neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(0,1));
	});

	it('should have west neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(0,-1));
	});

	it('should have north-east neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(-1,1));
	});

	it('should have nort-west neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(-1,-1));
	});

	it('should have south-east neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(1,1));
	});

	it('should have south-west neighboor', function() {
		new Location(0,0).neighboors.should.deep.contain(new Location(1,-1));
	});


});

describe('World', function() {

	it('should not contains locations with negative coordinates', function() {
		new World(2, 2).containsLocation(new Location(-1,-1)).should.be.false;
	});

	it('should not contains locations which exceeds its dimensions', function() {
		new World(1, 1).containsLocation(new Location(1, 1)).should.be.false;
	});

	it('should be in converted in last row when x is -1', function() {
		let world = new World(3, 1);
		let convertedLocation = world.convertLocation(new Location(-1, 0));
		convertedLocation.should.be.eql(new Location(2, 0));
	});

	it('should be converted in last col when y is -1', function() {
		let world = new World(3, 3);
		let convertedLocation = world.convertLocation(new Location(0, -1));
		convertedLocation.should.be.eql(new Location(0, 2));
	});

	it('should be in converted in first row when x is rows+1', function() {
		let world = new World(3, 3);
		let convertedLocation = world.convertLocation(new Location(3, 0));
		convertedLocation.should.be.eql(new Location(0, 0));
	});

	it('should be converted in first col when y is cols+1', function() {
		let world = new World(3, 3);
		let convertedLocation = world.convertLocation(new Location(0, 3));
		convertedLocation.should.be.eql(new Location(0, 0));
	});

});

describe('Game of Life', function() {

	it('should be valid with positive rows and cols and not living cells', function() {
		let gol = new GameOfLife({
			rows: 1,
			cols: 1,
			locationsWithLivingCell: []
		});
		gol.numberLivings.should.be.equal(0);
	});

	it('should only count distinct locations', function() {
		let gol = new GameOfLife({
			rows: 1,
			cols: 1,
			locationsWithLivingCell: [new Location(0,0), new Location(0,0)]
		});
		gol.numberLivings.should.be.equal(1);
	});

	it('should have at leats one row', function() {
		(function() {
			new GameOfLife({
				rows: 0,
				cols: 1
			})
		}).should.to.throw(Error, 'Invalid dimensions');
	});

	it('should have at leats one col', function() {
		(function() {
			new GameOfLife({
				rows: 1,
				cols: 0
			})
		}).should.to.throw(Error, 'Invalid dimensions');
	});

	it('should have locations contained in area', function() {
		(function() {
			new GameOfLife({
				rows: 1,
				cols: 1,
				locationsWithLivingCell: [new Location(1,1)]
			})
		}).should.to.throw(Error, 'Invalid configuration: many cells have invalid locations');
	});

	describe('born cells', function() {

		it('should born cell when have 3 alive neighboors', function() {

			let gol = new GameOfLife({
				rows: 4,
				cols: 4,
				locationsWithLivingCell: [new Location(0,0), new Location(0,1), new Location(1,0)]
			});
			let aliveByReproduction = new Location(1,1);

			let iteration = gol.iterate();

			gol.isCellAlive(aliveByReproduction).should.be.false;
			iteration.isCellAlive(aliveByReproduction).should.be.true;

		});

		it('should not born cell when have 2 alive neighboors', function() {

			let gol = new GameOfLife({
				rows: 4,
				cols: 4,
				locationsWithLivingCell: [new Location(0,0), new Location(0,1)]
			});
			let deadByIsolation = new Location(1,1);

			let iteration = gol.iterate();

			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 1 alive neighboors', function() {

			let gol = new GameOfLife({
				rows: 4,
				cols: 4,
				locationsWithLivingCell: [new Location(0,0)]
			});
			let deadByIsolation = new Location(1,1);

			let iteration = gol.iterate();

			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 0 alive neighboors', function() {

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: []
			});
			let deadByIsolation = new Location(2,2);

			let iteration = gol.iterate();

			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 4 alive neighboors', function() {

			let deadByIsolation = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: deadByIsolation.neighboors.splice(4)
			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(4);
			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 5 alive neighboors', function() {

			let deadByIsolation = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: deadByIsolation.neighboors.splice(3)
			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(5);
			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 6 alive neighboors', function() {


			let deadByIsolation = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: deadByIsolation.neighboors.splice(2)
			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(6);
			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 7 alive neighboors', function() {

			let deadByIsolation = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: deadByIsolation.neighboors.splice(1)
			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(7);
			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

		it('should not born cell when have 8 alive neighboors', function() {

			let deadByIsolation = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: deadByIsolation.neighboors
			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(8);
			gol.isCellAlive(deadByIsolation).should.be.false;
			iteration.isCellAlive(deadByIsolation).should.be.false;

		});

	});

	describe('survivor cells', function() {

		it('should survive when have 2 alive neighboors', function() {

			let survivor = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [survivor].concat(survivor.neighboors.splice(6))

			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(3);
			gol.isCellAlive(survivor).should.be.true;
			iteration.isCellAlive(survivor).should.be.true;

		});


		it('should survive when have 3 alive neighboors', function() {

			let survivor = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [survivor].concat(survivor.neighboors.splice(5))

			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(4);
			gol.isCellAlive(survivor).should.be.true;
			iteration.isCellAlive(survivor).should.be.true;

		});

	});

	describe('dead cells', function() {

		it('should dead when have 0 alive neighboors', function() {

			let alive = new Location(0,0);

			let gol = new GameOfLife({
				rows: 4,
				cols: 4,
				locationsWithLivingCell: [alive]

			});

			let iteration = gol.iterate();

			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});


		it('should dead when have 1 alive neighboors', function() {

			let alive = new Location(0,0);

			let gol = new GameOfLife({
				rows: 4,
				cols: 4,
				locationsWithLivingCell: [alive, new Location(0,1)]

			});

			let iteration = gol.iterate();

			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});

		it('should dead when have 4 alive neighboors', function() {

			let alive = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [alive].concat(alive.neighboors.splice(4))

			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(5);
			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});

		it('should dead when have 5 alive neighboors', function() {

			let alive = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [alive].concat(alive.neighboors.splice(3))

			});

			let iteration = gol.iterate();

			gol.numberLivings.should.be.equal(6);
			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});

		it('should dead when have 6 alive neighboors', function() {

			let alive = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [alive].concat(alive.neighboors.splice(2))
			});

			let iteration = gol.iterate();

			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});

		it('should dead when have 7 alive neighboors', function() {

			let alive = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [alive].concat(alive.neighboors.splice(1))
			});

			let iteration = gol.iterate();

			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});

		it('should dead when have 8 alive neighboors', function() {

			let alive = new Location(2,2);

			let gol = new GameOfLife({
				rows: 5,
				cols: 5,
				locationsWithLivingCell: [alive].concat(alive.neighboors)
			});

			let iteration = gol.iterate();

			gol.isCellAlive(alive).should.be.true;
			iteration.isCellAlive(alive).should.be.false;

		});



	});


})