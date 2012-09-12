(function(root) {

    var Flower = function(options)
    {
        // engine logic
        //
        //this.zIndex = 5;

        // flower logic
        //
        var size = root.Utils.getRandomInt(8, 18);

        this.zIndex = size;

        this.width = size;
        this.height = size;
        this.hsl = null;
        this.colour = null;
        this.rotate = root.Utils.getRandomInt(1, 180);
        this.originatingX = 0;
        this.stalkRGB = { r: 79, g: 140, b: 17 };
        this.stalkCurve = { x: root.Utils.getRandomInt(-50, 50), y: root.Utils.getRandomInt(50, 100) };
        this.stalkThickness = this.width / 6;
        this.stalkOpacity = 1;

        this.x = 0;
        this.y = 0;
        this.targetY = 0;
        this.targetX = 0;
        this.positionBuffer = 70; // distance to keep away from edges of stage
        this.growSpeed = 1;
        this.dieSpeed = 3;
        this.dieXRange = 10;
        this.dieAngle = 0;
        this.finalY = 0;

        // game logic
        //
        this.nectar = 100;
        this.decayRate = 0.05;
        this.growing = false;
        this.dying = false;

        // constructing
        //

        // set a random starting position
        //this._randomPosition();

        // set a random colour
        this._randomFlowerColour();

        // save a list of flowers
        root.Flower.flowers.push(this);

        this.grow();
    };

    Flower.prototype.update = function()
    {
        // animate up into the light!
        if ( this.growing ) {
            if ( this.y > this.targetY ) {
                var diff = this.y - this.targetY;
                this.y -= ( this.growSpeed / 5 ) + ( this.growSpeed * ( diff / 50 ) );
            } else {
                this.finalY = this.targetY;
                this.growing = false;
            }
        } else if ( this.dying ) {
            if ( this.y < ( this.targetY + ( this.height * 2 ) ) ) {
                this.x = this.targetX + Math.sin(this.dieAngle) * this.dieXRange;
                this.y += this.dieSpeed;

                this.dieAngle += 0.1;
            } else {
                this.dying = false;
                this._remove();
            }
        }

        // flowers slowly die over time
        this.drain(this.decayRate);
    };

    Flower.prototype.draw = function()
    {
        var ctx = root.Draw.getCanvas().context,
            originalLightness = this.hsl.lightness;

        // stalk mound
        if ( !this.dying ) {
            root.Draw.save();

            ctx.beginPath();
            ctx.fillStyle = '#999b0f';
            ctx.arc(this.originatingX, root.Game.getCanvasDimensions().height + 2, this.width / 2, 0, Math.PI*2, true);
            ctx.fill();
            root.Draw.restore();
        }

        // stalk
        // save before we set a stroke style for the stalk
        root.Draw.save();

        // fade out stalk if dying
        var stalkX = this.x,
            stalkY = this.y;

        if ( this.dying ) {
            if ( this.stalkOpacity > 0 ) {
                this.stalkOpacity -= 0.04;

                if ( this.stalkOpacity < 0) {
                    this.stalkOpacity = 0;
                }
            }

            stalkX = this.targetX;
            stalkY = this.finalY;
        }

        ctx.strokeStyle = 'rgba(' + this.stalkRGB.r + ', ' + this.stalkRGB.g + ', ' + this.stalkRGB.b +', ' + this.stalkOpacity + ')';
        ctx.lineWidth = this.stalkThickness;
        ctx.beginPath();
        var stalkBottom = ( this.dying ) ? root.Game.getCanvasDimensions().height : ( ( root.Game.getCanvasDimensions().height - this.height / 2 ) + 3 );
        ctx.moveTo(this.originatingX, stalkBottom );
        ctx.quadraticCurveTo(stalkX + this.stalkCurve.x, stalkY + this.stalkCurve.y, stalkX, stalkY);
        ctx.stroke();

        root.Draw.restore();

        // save before we rotate/transform the canvas for the flower rotation
        root.Draw.save();

        // spin the flower downwards if dying
        if ( this.dying ) this.rotate += 0.05;

        // the centre point to rotate around
        root.Draw.translateCanvas( this.x + (this.width / 2), this.y + (this.width / 2) );
        root.Draw.rotateCanvas( this.rotate );

        // offset back to the our original point to begin drawing
        root.Draw.translateCanvas( -(this.width / 2), -(this.width / 2) );

        // -- DRAW TIME!
        // flower core
        root.Draw.drawRectangle(this.colour, 0, 0, this.width, this.height);

        // petals
        this.hsl.lightness -= 10;
        this._updateColour();

        root.Draw.drawRectangle(this.colour, 0, ( -this.height + 1 ), this.width, this.height);   // top
        root.Draw.drawRectangle(this.colour, ( this.width - 1 ), 0, this.width, this.height);     // right
        root.Draw.drawRectangle(this.colour, 0, ( this.height - 1 ), this.width, this.height);    // bottom
        root.Draw.drawRectangle(this.colour, ( -this.width + 1 ), 0, this.width, this.height);    // left

        this.hsl.lightness = originalLightness;
        this._updateColour();

        root.Draw.restore();
    };

    Flower.prototype._randomPosition = function()
    {
        var canvas = root.Game.getCanvasDimensions(),
            x = root.Utils.getRandomInt( this.positionBuffer / 2, canvas.width - this.positionBuffer ), // with a padding buffer
            y = root.Utils.getRandomInt( this.positionBuffer, canvas.height - this.positionBuffer );    // with a padding buffer

        this.x = this.targetX = x;
        this.y = canvas.height;
        this.originatingX = root.Utils.getRandomInt(x - (this.width * 2), x + (this.width * 2));

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

        // root.Draw.drawRectangle('#ff0000', this.x, this.y, this.width, this.height);
        root.Draw.drawRectangle('#ff0000', 0, 0, 300, 300);

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
        var targetPos = this._randomPosition();

        this.targetY = targetPos.y;
        this.growing = true;
    };

    Flower.prototype.die = function()
    {
        this.targetY = root.Game.getCanvasDimensions().height;
        this.dying = true;
    };

    Flower.prototype.drain = function(amount)
    {
        this.nectar -= amount;

        if (this.nectar <= 0) {
            this.die();
        }

        var newLightness = 40 + (100 - this.nectar);
        if ( newLightness > 90 ) newLightness = 90;
        this.hsl.lightness = newLightness;
        this._updateColour();
    };

    Flower.flowers = [];

    root.Flower = Flower;

})(window);