$(document).ready(function() {
	console.log('ready!');
});

var gameOfLifeManager = (function() {
	var gol = new GameOfLife({
                        rows: 1,
                        cols: 1,
                        locationsWithLivingCell: []
                });
})();
