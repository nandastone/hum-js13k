(function(root) {

	var UI = (function()
	{
		var $weight = document.getElementById('weight');

		var displayWeight = function(weight)
		{
			$weight.innerHTML = weight.toFixed(1);
		};

		return {
			displayWeight: displayWeight
		};

	})();

	root.UI = UI;

})(window);