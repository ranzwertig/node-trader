
/*
    Abstract equity indicator returning 1,0,-1 depending on equity and index
*/


(function() {
  var Indicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Indicator = (function() {
    /*
            @param {object} equity
            @param {object} index
    */

    function Indicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    /*
            returns 1,0,-1 based on equity and index or a Error on error
    */


    Indicator.prototype.calculate = function() {
      return new Error;
    };

    /*
        Static factory method
    */


    Indicator.create = function() {
      var args, c, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      c = require('./indicators/' + name.toLowerCase() + '.js');
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(c, args, function(){});
    };

    return Indicator;

  })();

  module.exports = Indicator;

}).call(this);
