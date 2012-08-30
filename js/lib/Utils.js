(function(root) {

    var Utils = (function()
    {

        var getRandomInt = function(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var getRandomColour = function(saturation, lightness)
        {
            var hue = getRandomInt(1, 360); // pick a random hue

            return { hue: hue, saturation: saturation, lightness: lightness };
        };

        var compareObjects = function(obj1, obj2)
        {
            var p;
            for(p in obj1) {
              if(typeof(obj2[p])=='undefined') {return false;}
            }

            for(p in obj1) {
              if (obj1[p]) {
                  switch(typeof(obj1[p])) {
                      case 'object':
                          if (!compareObjects(obj1[p], (obj2[p]))) { return false; } break;
                      case 'function':
                          if (typeof(obj2[p])=='undefined' ||
                              (p != 'equals' && obj1[p].toString() != obj2[p].toString()))
                              return false;
                          break;
                      default:
                          if (obj1[p] != obj2[p]) { return false; }
                  }
              } else {
                  if (obj2[p])
                      return false;
              }
            }

            for(p in obj2) {
              if(typeof(obj1[p])=='undefined') {return false;}
            }

            return true;
        };

        var removeFromArray = function(arr, obj)
        {
            for (var i = 0, l = arr.length; i < l; i++) {
                if ( root.Utils.compareObjects( obj, arr[i] ) ) {
                    arr.splice(i, 1);
                    return true;
                }
            }

            return false;
        };


        return {
            getRandomInt: getRandomInt,
            getRandomColour: getRandomColour,
            compareObjects: compareObjects,
            removeFromArray: removeFromArray
        };

    })();

    root.Utils = Utils;

})(window);