(function(root) {

	var Flower = function(options)
	{
		// engine logic
        //

        // flower logic
        //
        this.width = 15;
		this.height = 15;
        this.hsl = null;
        this.colour = null;

		this.x = 0;
		this.y = 0;
        this.positionBuffer = 70; // distance to keep away from edges of stage

        // game logic
        //
        this.nectar = 100;

        // constructing
        //

        // set a random starting position
        this._randomPosition();

        // set a random colour
        this._randomFlowerColour();

        // save a list of flowers
        root.Flower.flowers.push(this);
	};

	Flower.prototype.setPos = function(pos)
	{
		this.x = pos.x;
		this.y = pos.y;
	};

	Flower.prototype.update = function()
	{
        // flowers slowly die over time
        this.drain(0.1);
	};

	Flower.prototype.draw = function()
	{
		root.Draw.drawRectangle(this.colour, this.x, this.y, this.width, this.height);
	};

    Flower.prototype._randomPosition = function()
    {
        var canvas = root.Game.getCanvasDimensions(),
            x = root.Utils.getRandomInt( this.positionBuffer, canvas.width - this.positionBuffer ), // with a padding buffer
            y = root.Utils.getRandomInt( this.positionBuffer, canvas.height - this.positionBuffer ); // with a padding buffer
        
        this.x = x;
        this.y = y;

        return { x: x, y: y };
    };

    Flower.prototype._randomFlowerColour = function()
    {
        this.hsl = root.Utils.getRandomColour(70, 50);
        this._updateColour();
    };

    Flower.prototype._updateColour = function()
    {
        this.colour = "hsl(" + this.hsl.hue + ", " + this.hsl.saturation + "%, " + this.hsl.lightness + "%)";
    };

    Flower.prototype._remove = function()
    {
        // remove from the update list
        root.Game.removeFromUpdate(this);

        // remove from the draw list
        root.Game.removeFromDraw(this);

        // remove from the flower list
        if ( !root.Utils.removeFromArray( root.Flower.flowers, this ) ) {
            throw new Error('Failed to remove the flower from the root.Flower.flowers array.');
        }
    };

    Flower.prototype.isNear = function(thing)
    {
        // compares the nearness of a single point (x,y) to the flower

        // outside top left corner?
        if ( thing.x < this.x || thing.y < this.y ) {
            return false;
        }

        // outside bottom right corner?
        if ( thing.x > ( this.x + this.width ) || thing.y > ( this.y + this.height ) ) {
            return false;
        }

        return true;
    };

	// game logic
    Flower.prototype.grow = function()
    {

    };

    Flower.prototype.die = function()
    {
        //this.colour = '#ffffff';
        this._remove();
    };

    Flower.prototype.drain = function(amount)
    {
        this.nectar -= amount;

        if (this.nectar <= 0) {
            this.die();
        }

        this.hsl.lightness += amount / 2.5;
        this._updateColour();
    };

    Flower.flowers = [];

	root.Flower = Flower;

})(window);