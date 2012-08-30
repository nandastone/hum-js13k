(function(root) {

	var Game = (function()
	{
		var _canvas,
			canvas,
			_toUpdate = [],
			_toDraw = [];

		// game logic
		var max_flowers = 5;

		var _useCanvas = function(id)
		{
			_canvas = document.getElementById(id);
			
			canvas = {
				context : _canvas.getContext('2d'),
				width : _canvas.width,
				height : _canvas.height
			};

			console.log('Canvas setup:', canvas);
		};

		var _renderLoop = function()
		{
			// request a new frame
			requestAnimFrame(_renderLoop);

			// render everything
			_updateAll();
			_drawAll();
		};

		var _updateAll = function()
		{
			for (var i = 0, l = _toUpdate.length; i < l; i++) {
				_toUpdate[i].update();
			}
		};

		var _drawAll = function()
		{
			// clear screen
			root.Draw.clear();

			// draw background
			root.Draw.drawRectangle('#00ffcc', 0, 0, canvas.width, canvas.height);

			for (var i = 0, l = _toDraw.length; i < l; i++) {
				_toDraw[i].draw();
			}
		};

		var _placeFlowers = function()
		{
			var flower1 = new root.Flower();
			flower1.setPos({ x: 100, y: 100 });
			_toDraw.push(flower1);

		};

		var _bindEvents = function()
		{

		};

		var keyUp = function(e)
		{
			var charCode = (e.charCode) ? e.charCode : e.keyCode;

			//console.log('key up', e, charCode);

			// SPACE = flap birdy!
			if (charCode === 32) {
				this.bird.flap();
			}
		};

		var keyDown = function(e)
		{
			var charCode = (e.charCode) ? e.charCode : e.keyCode;

			//console.log('key down', e, charCode);

			// LEFT = move birdy!
			if (charCode === 37) {
				this.bird.left();
			}

			// RIGHT = move birdy!
			if (charCode === 39) {
				this.bird.right();
			}
		};

		var init = function() {
			console.log('Starting the game!');

			console.log('Setting up the canvas!');
			_useCanvas('stage');

			console.log('Setting up the drawer!');
			root.Draw.setCanvas(canvas);

			console.log('Binding events!');
			_bindEvents();

			console.log('Creating the bird!');
			this.bird = new root.Bird();
			_toUpdate.push(this.bird);
			_toDraw.push(this.bird);

			this.bird.setPos({ x: 300, y: 0 });

			console.log('Creating some flowers!');
			_placeFlowers();
			/*var flower1 = new root.Flower();
			flower1.setPos({ x: 100, y: 100 });
			_toDraw.push(flower1);

			var flower2 = new root.Flower();
			flower2.setPos({ x: 200, y: 200 });
			_toDraw.push(flower2);

			var flower3 = new root.Flower();
			flower3.setPos({ x: 300, y: 300 });
			_toDraw.push(flower3);*/

			console.log('Starting render loop!');
			_renderLoop();
		};

		return {
			init: init,
			keyDown: keyDown,
			keyUp: keyUp
		};
	})();

	root.Game = Game;

})(window);