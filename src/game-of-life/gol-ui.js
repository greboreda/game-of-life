$(document).ready(function() {
	console.log('ready!');
});

var gameOfLifeManager = (function() {
	var game = new gol.GameOfLife({
                        rows: 1,
                        cols: 1,
                        locationsWithLivingCell: []
                });
})();
