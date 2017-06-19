
(function() {
    // Promise polyfill
    if (!window.Promise) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/vendor/promise-polyfill.min.js";
        document.body.appendChild(script);
    }
    // fetch Polyfill
    if(!window.fetch){
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "/vendor/fetch-polyfill.js";
        document.body.appendChild(js);
    }
    // object.assign polyfill
    if (typeof Object.assign != "function") {
      (function () {
        Object.assign = function (target) {

          // We must check against these specific cases.
          if (target === undefined || target === null) {
              throw new TypeError("Cannot convert undefined or null to object");
          }

          var output = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
              for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                  output[nextKey] = source[nextKey];
                }
              }
            }
          }
          return output;
        };
      })();
    }
    // array.find polyfill
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, "find", {
        value: function(predicate) {

            if (this == null) {
                throw new TypeError("Array.prototype.find called on null or undefined");
            }
            if (typeof predicate !== "function") {
                throw new TypeError("predicate must be a function");
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                 return value;
                }
            }
            return undefined;
        }
    });
    // array.findIndex polyfill
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, "findIndex", {
            value: function(predicate) {

                if (this == null) {
                    throw new TypeError("Array.prototype.findIndex called on null or undefined");
                }
                if (typeof predicate !== "function") {
                    throw new TypeError("predicate must be a function");
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;

                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return i;
                    }
                }
                return -1;
            },
            enumerable: false,
            configurable: false,
            writable: false
        });
    }

}
})();
