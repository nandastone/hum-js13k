(function(root) {

    var Game = (function()
    {
        var _canvas,
            canvas,
            _toUpdate = [],
            _toDraw = [];

        // game logic
        var _maxFlowers = 5,
            _createNewFlowerTimer = null;

        // game objects
        var _bird = 'lol';

        var _useCanvas = function(id)
        {
            _canvas = document.getElementById(id);
            
            canvas = {
                context : _canvas.getContext('2d'),
                width : _canvas.width,
                height : _canvas.height
            };

            console.log('Canvas setup:', canvas);
        };

        var _renderLoop = function()
        {
            // request a new frame
            requestAnimFrame(_renderLoop);

            _logic();

            // render everything
            _updateAll();
            _drawAll();
        };

        var _logic = function()
        {
            // create a new flower if we need more
            // TODO: have a delay before creating a new flower
            if ( root.Flower.flowers.length < _maxFlowers ) {
                var newFlower = new root.Flower();
                _toUpdate.push(newFlower);
                _toDraw.push(newFlower);

                console.log('Creating new flower', newFlower);
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
            root.Draw.drawRectangle('#00ffcc', 0, 0, canvas.width, canvas.height);

            for (var i = 0, l = _toDraw.length; i < l; i++) {
                var drawItem = _toDraw[i];

                if ( drawItem === null || typeof drawItem === 'undefined' ) continue;

                drawItem.draw();
            }
        };

        var _bindEvents = function()
        {
            var _this = this;

            KeyboardController({
                // space bar
                32: function() { _bird.flap(); },
                // left arrow key
                37: function() { _bird.left(); },
                // right arrow key
                39: function() { _bird.right(); }
            }, 50);
        };

        var removeFromUpdate = function(obj)
        {
            if ( !root.Utils.removeFromArray( _toUpdate, obj ) ) {
                throw new Error('Failed to remove an object from the _toUpdate array.');
            }
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

        var keyUp = function(e)
        {
            var charCode = (e.charCode) ? e.charCode : e.keyCode;

            //console.log('key up', e, charCode);

            // SPACE = flap birdy!
            if (charCode === 32) {
                this.bird.flap();
            }
        };

        var keyDown = function(e)
        {
            var charCode = (e.charCode) ? e.charCode : e.keyCode;

            //console.log('key down', e, charCode);

            // LEFT = move birdy!
            if (charCode === 37) {
                this.bird.left();
            }

            // RIGHT = move birdy!
            if (charCode === 39) {
                this.bird.right();
            }
        };

        var init = function() {
            console.log('Starting the game!');

            console.log('Setting up the canvas!');
            _useCanvas('stage');

            console.log('Setting up the drawer!');
            root.Draw.setCanvas(canvas);

            console.log('Binding events!');
            _bindEvents();

            console.log('Creating some flowers!');

            console.log('Creating the bird!');
            _bird = new root.Bird();
            _toUpdate.push(_bird);
            _toDraw.push(_bird);

            console.log('birdy bird', _bird);

            _bird.setPos({ x: 300, y: 0 });

            console.log('Starting render loop!');
            _renderLoop();
        };

        return {
            init: init,
            keyDown: keyDown,
            keyUp: keyUp,
            getCanvasDimensions: getCanvasDimensions,
            removeFromDraw: removeFromDraw,
            removeFromUpdate: removeFromUpdate,

            testUpdateList: _toUpdate,
            testDrawList: _toDraw
        };
    })();

    root.Game = Game;

})(window);

// Keyboard input with customisable repeat (set to 0 for no key repeat)
//
function KeyboardController(keys, repeat)
{
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = function(event)
    {
        var key = (event || window.event).keyCode;
        
        if (!(key in keys))
            return true;

        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat !== 0)
                timers[key] = setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = function(event)
    {
        var key = (event || window.event).keyCode;
        
        if (key in timers) {
            if (timers[key] !== null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur = function()
    {
        for (key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }
        }
        
        timers = {};
    };
}