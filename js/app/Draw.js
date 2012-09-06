(function(root) {

	var Draw = (function()
	{
		var canvas;

		var drawRectangle = function (color, x, y, width, height)
		{
			save();
			canvas.context.fillStyle = color;
			canvas.context.fillRect(x, y, width, height);
			restore();
		};

		var drawImage = function($el, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight)
		{
			canvas.context.drawImage($el, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
		};

		var translateCanvas = function(x, y)
		{
			canvas.context.translate(x, y);
		};

		var rotateCanvas = function(degrees)
		{
			canvas.context.rotate(degrees);
		};

		var setCanvas = function(newCanvas)
		{
			canvas = newCanvas;
		};

		var getCanvas = function()
		{
			return canvas;
		};

		var clear = function()
		{
			canvas.context.clearRect(0, 0, canvas.width, canvas.height);
		};

		var save = function()
		{
			canvas.context.save();
		};

		var restore = function()
		{
			canvas.context.restore();
		};

		return {
			setCanvas: setCanvas,
			getCanvas: getCanvas,

			drawRectangle: drawRectangle,
			drawImage: drawImage,
			clear: clear,
			save: save,
			restore: restore,
			rotateCanvas: rotateCanvas,
			translateCanvas: translateCanvas
		};
	})();

	root.Draw = Draw;

})(window);