(function() {
  var EquityRatioIndicator, Indicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  EquityRatioIndicator = (function(_super) {

    __extends(EquityRatioIndicator, _super);

    function EquityRatioIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    EquityRatioIndicator.prototype.calculate = function() {
      var val;
      val = this.equity.latestFacts.equityRatio;
      if (val === null) {
        return new Error;
      }
      if (val > 25) {
        return 1;
      }
      if (val < 15) {
        return -1;
      }
      return 0;
    };

    return EquityRatioIndicator;

  })(Indicator);

  module.exports = EquityRatioIndicator;

}).call(this);
