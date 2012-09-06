(function(root) {

    var Bird = function()
    {
        // engine logic
        //
        this.zIndex = 100;

        // flower logic
        //
        this.width = this.originalWidth = 30;
        this.height = this.originalHeight = 30;
        this.sprite = document.getElementById('hum');
        this.frames = 3;
        this.curFrame = 0;

        // affects how fast the bird falls
        this.weight = 2;
        // affects how much the bird rises when he flaps his tiny wings
        this.lift = 0.2;
        // affects his left/right movement speed
        this.speed = 1.5;
        // how much nectar birdy eats!
        this.hunger = 2;
        // how much energy birdy has to flap
        this.energy = 100;

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
        this.drainRate = 2;
        this.lastWeightDisplayed = 0;
        this.canvas = root.Game.getCanvasDimensions();
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

        this.yAccel += ( this.weight / 100 );

        var newX = this.x + this.xAccel,
            newY = this.y + this.yAccel;

        // bounds checking - vertical top
        if ( ( newY + this.height ) < 0 ) {
            newY = this.y;
            this.yAccel = 0;
        }

        // bounds checking - vertical bottom
        if ( ( newY - this.height ) > this.canvas.height ) {
            root.Game.end();
        }

        // bounds checking - left
        if ( newX < 0 ) {
            newX = 0;
        }

        if ( newX > ( this.canvas.width - this.width ) ) {
            newX = ( this.canvas.width - this.width );
        }

        // finally, update our bird's position
        this.x = newX;
        this.y = newY;

        this._logic();
    };

    Bird.prototype.draw = function()
    {
        root.Draw.drawImage(this.sprite, this.originalWidth * this.curFrame, 0, this.originalWidth, this.originalHeight, this.x, this.y, this.width, this.height);

        this.curFrame++;
        if ( this.curFrame > (this.frames - 1) ) {
            this.curFrame = 0;
        }

        // sipping animation
        if ( this.flower !== null ) {
            root.Draw.save();

            var ctx = root.Draw.getCanvas().context;
            ctx.strokeStyle = "#da0aa2";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 16);
            ctx.lineTo(this.x - 2, this.y + 19);
            ctx.stroke();

            root.Draw.restore();
        }
    };

    Bird.prototype._logic = function()
    {
        // are we near flowers?
        var flowers = root.Flower.flowers,
            currentFlower = null;

        for (var i = 0, l = flowers.length; i < l; i++) {
            var pos = { x: this.x, y: this.y + 15 }; // adjust the suckle point

            if (flowers[i].isNear(pos)) {
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

        // update the bird's weight in the UI
        if ( this.lastWeightDisplayed + 0.1 < this.weight ) {
            this.lastWeightDisplayed = this.weight;
            root.UI.displayWeight(this.weight);
        }
    };

    // game logic
    Bird.prototype.flap = function()
    {
        // don't flap when too high
        if ( this.y < 0 ) return;

        // consume a bit of energy
        this.energy -= 0.3;
        this._capAndDisplayEnergy();

        // more lift the lower you are down the screen
        // less lift the less energy you have
        var newYAccel = this.yAccel - ( ( this.lift - ( 100 - this.energy ) / 1000 ) + ( this.y * 0.001) );

        // hard coded little "jump" of lift
        this.y -= ( this.lift * 5 );
        
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
        this.flower.drain(this.drainRate);

        // increase the bird's weight
        this.weight += ( this.drainRate / 800 );

        // give the bird some more energy
        this.energy += 0.6;
        this._capAndDisplayEnergy();

        // adjust the bird's size based on weight
        //this.width = this.height = this.originalWidth + (this.weight * 2);

        this.flowerSippingTimer = setTimeout(function() { _this._sipFlower(); }, 50);
    };

    Bird.prototype._capAndDisplayEnergy = function() {
        if ( this.energy < 0 ) this.energy = 0;
        if ( this.energy > 100 ) this.energy = 100;

        root.UI.displayEnergy(this.energy);
    };

    root.Bird = Bird;

})(window);