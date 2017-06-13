var should = require("chai").should();
var GOL = require('../GameOfLife.js');
var GameOfLife = GOL.GameOfLife;
var Location = GOL.Location;
var World = GOL.World;

describe('Location', function() {

	it('should be equal to another with same x and y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(0, 0);
		location1.should.be.eql(location2);
	});

	it('should be equal to another with distinct x and same y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(1, 0);
		location1.should.not.be.eql(location2);
	});

	it('should be equal to another with same x and distinct y', function() {
		let location1 = new Location(0, 0);
		let location2 = new Location(0, 1);
		location1.should.not.be.eql(location2);
	});

	it('should be equal to another with distinct x and y', function() {
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

	it('should have area equal to rows * cols', function() {
		new World(2, 2).area.should.be.equal(4);
	});

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

})