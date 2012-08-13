(function(root) {

	var Draw = (function()
	{
		var canvas;

		var drawRectangle = function (color, x, y, width, height)
		{
			canvas.context.fillStyle = color;
			canvas.context.fillRect(x, y, width, height);
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

		return {
			setCanvas: setCanvas,
			getCanvas: getCanvas,

			drawRectangle: drawRectangle,
			clear: clear
		};
	})();

	root.Draw = Draw;

})(window);