(function(root) {

    var Game = (function()
    {
        var _canvas,
            canvas,
            _toUpdate = [],
            _toDraw = [],
            _ended = false;

        // game logic
        var _maxFlowers = 15,
            _createNewFlowerTimer = null;

        // game objects
        var _bird = null;

        // background visuals
        var _backgroundGradient = null;
        var _groundHeight = 35;
        var _sunGradient = null;

        var _useCanvas = function(id)
        {
            _canvas = document.getElementById(id);
            
            canvas = {
                context : _canvas.getContext('2d'),
                width : _canvas.width,
                height : _canvas.height
            };

            _backgroundGradient = canvas.context.createLinearGradient(canvas.width / 3, 0, canvas.width / 2, canvas.height);
            _backgroundGradient.addColorStop(0, '#e99825');
            _backgroundGradient.addColorStop(1, '#e92553');

            _sunGradient = canvas.context.createRadialGradient(115, 100, 0, 105, 90, 100);
            _sunGradient.addColorStop(0, 'rgba(240,217,19,1)');
            _sunGradient.addColorStop(0.95, 'rgba(240,196,19,.9)');
            _sunGradient.addColorStop(1, 'rgba(240,196,19,0)');

            console.log('Canvas setup:', canvas);
        };

        var _renderLoop = function()
        {
            if ( _ended ) return;

            // request a new frame
            requestAnimFrame(_renderLoop);

            _logic();

            // render everything
            _updateAll();
            _drawAll();
        };

        var _logic = function()
        {
            // keyboard events
            if (Key.isDown(Key.LEFT)) _bird.left();
            if (Key.isDown(Key.RIGHT)) _bird.right();
            if (Key.isPreserved(Key.SPACE)) _bird.flap();

            if ( _createNewFlowerTimer === null ) {
                _createNewFlowerTimer = setTimeout(function() {
                    clearTimeout(_createNewFlowerTimer);
                    _createNewFlowerTimer = null;

                    // only a create a flower one in three times
                    if ( root.Utils.getRandomInt(1, 3) !== 1 ) return;

                    if ( root.Flower.flowers.length < _maxFlowers ) {
                        var newFlower = new root.Flower();

                        addToUpdate(newFlower);
                        addToDraw(newFlower);

                        console.log('Creating new flower', newFlower);
                    }
                }, root.Utils.getRandomInt(200, 1000));
            }

        };

        var _updateAll = function()
        {
            for (var i = 0, l = _toUpdate.length; i < l; i++) {
                var updateItem = _toUpdate[i];
                
                if ( updateItem === null|| typeof updateItem === 'undefined' ) continue;

                updateItem.update();
            }
        };

        var _drawAll = function()
        {
            // clear screen
            root.Draw.clear();

            // draw background
            root.Draw.save();
            canvas.context.fillStyle = _backgroundGradient;
            canvas.context.fillRect(0, 0, canvas.width, canvas.height);
            root.Draw.restore();

            // draw the ground
            root.Draw.drawRectangle('#999b0f', 0, canvas.height - _groundHeight, canvas.width, _groundHeight);

            // draw the sun
            root.Draw.save();
            canvas.context.fillStyle = _sunGradient;
            canvas.context.fillRect(5, -10, 200, 200);
            root.Draw.restore();

            // draw everything else
            for (var i = 0, l = _toDraw.length; i < l; i++) {
                var drawItem = _toDraw[i];

                if ( drawItem === null || typeof drawItem === 'undefined' ) continue;

                drawItem.draw();
            }
        };

        var _bindEvents = function()
        {
            // keyboard events for game control
            window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
            window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        };

        var addToUpdate = function(obj)
        {
            _toUpdate.push(obj);
            // no need to sort by z-index, don't really care who's updated first
        };

        var removeFromUpdate = function(obj)
        {
            if ( !root.Utils.removeFromArray( _toUpdate, obj ) ) {
                throw new Error('Failed to remove an object from the _toUpdate array.');
            }
        };

        var addToDraw = function(obj)
        {
            _toDraw.push(obj);
            // sort the draw array by the zIndex to allow for proper layering
            _toDraw.sort(root.Utils.sortByZIndex);
        };

        var removeFromDraw = function(obj)
        {
            if ( !root.Utils.removeFromArray( _toDraw, obj ) ) {
                throw new Error('Failed to remove an object from the _toDraw array.');
            }
        };

        var getCanvasDimensions = function()
        {
            return { width: canvas.width, height: canvas.height };
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
            _bird = new root.Bird();
            addToUpdate(_bird);
            addToDraw(_bird);
            _bird.setPos({ x: 300, y: canvas.height });
            _bird.yAccel = -4;

            console.log('Showing intro screen');
            root.UI.showIntro();
        };

        var start = function()
        {
            console.log('Starting render loop!');
            _renderLoop();
        };

        var end = function()
        {
            _ended = true;
            root.UI.showEnd();
        };

        return {
            init: init,
            start: start,
            end: end,
            getCanvasDimensions: getCanvasDimensions,
            removeFromDraw: removeFromDraw,
            removeFromUpdate: removeFromUpdate,

            testUpdateList: _toUpdate,
            testDrawList: _toDraw
        };
    })();

    root.Game = Game;

})(window);

var Key = {
    _pressed: {},
    _preserved: {},

    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    isPreserved: function(keyCode) {
        if ( typeof this._preserved[keyCode] !== 'undefined' ) {
            delete this._preserved[keyCode];
            return true;
        }

        return false;
    },

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        // we always want to know if this was pressed, even if it is no longer pressed when we check
        // we do this by adding it to a preserved list that is not cleared on keyup
        if ( event.keyCode === Key.SPACE ) {
            this._preserved[event.keyCode] = true;
        }

        delete this._pressed[event.keyCode];
    }
};