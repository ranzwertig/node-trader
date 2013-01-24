(function() {
  var Indicator, PeRatioIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  PeRatioIndicator = (function(_super) {

    __extends(PeRatioIndicator, _super);

    function PeRatioIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    PeRatioIndicator.prototype.calculate = function() {
      var val;
      val = this.equity.latestFacts.peRatio;
      if (val === null) {
        return new Error;
      }
      if (val < 12) {
        return 1;
      }
      if (val > 16) {
        return -1;
      }
      return 0;
    };

    return PeRatioIndicator;

  })(Indicator);

  module.exports = PeRatioIndicator;

}).call(this);
