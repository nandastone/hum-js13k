(function(root) {

	var Flower = function()
	{
		this.width = 15;
		this.height = 15;
        this.colour = this.randomFlowerColour();

		this.x = 0;
		this.y = 0;

        // game logic
        this.nectar = 100;

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
	};

	Flower.prototype.draw = function()
	{
		root.Draw.drawRectangle(this.colour, this.x, this.y, this.width, this.height);
	};

    Flower.prototype.randomFlowerColour = function()
    {
        return '#ff0000';
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
        this.colour = '#ffffff';
    };

    Flower.prototype.drain = function(amount)
    {
        this.nectar -= amount;

        if (this.nectar <= 0) {
            this.die();
        }
    };

    Flower.flowers = [];

	root.Flower = Flower;

})(window);