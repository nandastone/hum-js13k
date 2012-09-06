(function(root) {

	var UI = (function()
	{
		var $$ = function(id) { return document.getElementById(id); },
			$intro = $$('intro'),
			$end = $$('end'),
			$begin = $$('begin'),
			$again = $$('again'),
			$weight = $$('weight'),
			$weighty = $$('weighty'),
			$energy = $$('energy'),
			$remaining = $$('remaining');

		var _showEl = function(el)
		{
			el.style.display = 'block';
		};

		var _hideEl = function(el)
		{
			el.style.display = 'none';
		};

		var showIntro = function()
		{
			_showEl($intro);
			$begin.addEventListener('click', function(event) {
				_hideEl($intro);
				_showEl($weighty);
				_showEl($energy);
				root.Game.start();
			}, false);
		};

		var showEnd = function()
		{
			_hideEl($weighty);
			_showEl($end);
			$again.addEventListener('click', function(event) { document.location.reload(true); }, false);
		};

		var displayWeight = function(weight)
		{
			$weight.innerHTML = weight.toFixed(1);
		};

		var displayEnergy = function(energy)
		{
			$remaining.style.width = Math.floor(energy * 1.5) + 'px';
			console.log($remaining);
			console.log('energy:', energy);
		};

		return {
			showIntro: showIntro,
			showEnd: showEnd,
			displayWeight: displayWeight,
			displayEnergy: displayEnergy
		};

	})();

	root.UI = UI;

})(window);