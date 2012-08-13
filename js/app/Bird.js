(function(root) {

	var Bird = function()
	{
		this.width = 30;
		this.height = 30;

        // affects how fast the bird falls
        this.weight = 0.03;
        // affects how much the bird rises when he flaps his tiny wings
        this.lift = 0.3;
        // affects his left/right movement speed
        this.speed = 5;
        // how much nectar birdy eats!
        this.hunger = 2;

		this.x = 0;
		this.y = 0;
		this.xAccel = 0;
		this.yAccel = 0.02;
        // the bird has a limit to it's upward movement
        this.maxYUpAccel = 2.5;
        // currently no limit to downward movement
        //this.maxYDownAccel = 4;

        // game logic
        this.flower = null;
        this.flowerSippingTimer = null;
        this.flowerTargetTimer = null;
	};

	Bird.prototype.setPos = function(pos)
	{
		this.x = pos.x;
		this.y = pos.y;
	};

    Bird.prototype.getPos = function()
    {
        return pos;
    };

	Bird.prototype.update = function()
	{
        // clamp the downwards acceleration
		/*if ( Math.abs(this.yAccel + this.weight) < this.maxYUpAccel ) {
            this.yAccel += this.weight;
        }*/

        this.yAccel += this.weight;

        var newX = this.x + this.xAccel,
            newY = this.y + this.yAccel;

		// bounds checking - vertical top
		if ( ( newY + this.height ) < 0 ) {
			newY = this.y;
            this.yAccel = 0;
		}

        // finally, update our bird's position
        this.x = newX;
        this.y = newY;

        this._logic();
	};

	Bird.prototype.draw = function()
	{
		root.Draw.drawRectangle('#ff0000', this.x, this.y, this.width, this.height);
	};

    Bird.prototype._logic = function()
    {
        // are we near flowers?
        var flowers = root.Flower.flowers,
            currentFlower = null;

        for (var i = 0, l = flowers.length; i < l; i++) {
            if (flowers[i].isNear(this)) {
                currentFlower = flowers[i];
                this._targetFlower(currentFlower);
                break;
            }
        }

        // if not near any flowers at all
        if ( currentFlower === null ) {
            // unset our flower reference
            this.flower = null;
            // clear all the timeouts for throttling sip rate
            clearTimeout(this.flowerTargetTimer);
            clearTimeout(this.flowerSippingTimer);
        }
    };

	// game logic
	Bird.prototype.flap = function()
	{
        // more lift the lower you are down the screen
        var newYAccel = this.yAccel - ( this.lift + ( this.y * 0.001) );
        
        // clamp the upwards acceleration
        if ( newYAccel < -this.maxYUpAccel) {
            return;
        }
		
        this.yAccel = newYAccel;
	};

    Bird.prototype.left = function()
    {
        this.x -= this.speed;
    };

    Bird.prototype.right = function()
    {
        this.x += this.speed;
    };

    Bird.prototype._targetFlower = function(flower)
    {
        var _this = this;

        // if we're already sipping this flower, don't do anything
        if (this.flower === flower) {
            return;
        }

        this.flower = flower;

        // pass the actual sipping to another function that is throttled via a timeout
        // the initial timer makes you hover for a bit before you can sip
        this.flowerTargetTimer = setTimeout(function() { _this._sipFlower(); }, 200);
    };

    Bird.prototype._sipFlower = function() {
        var _this = this;

        // drain the flower
        this.flower.drain(2);

        this.flowerSippingTimer = setTimeout(function() { _this._sipFlower(); }, 50);
    };

	root.Bird = Bird;

})(window);