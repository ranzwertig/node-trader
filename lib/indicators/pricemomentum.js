(function() {
  var Indicator, PriceMomentumIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  PriceMomentumIndicator = (function(_super) {

    __extends(PriceMomentumIndicator, _super);

    function PriceMomentumIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    PriceMomentumIndicator.prototype.calculate = function() {
      var score12M, score6M;
      score12M = Indicator.create('performance12m', this.equity, this.index).calculate();
      score6M = Indicator.create('performance6m', this.equity, this.index).calculate();
      if (score12M instanceof Error || score6M instanceof Error) {
        return new Error;
      }
      if (score6M === 1 && score12M <= 0) {
        return 1;
      }
      if (score6M === -1 && score12M >= 0) {
        return -1;
      }
      return 0;
    };

    return PriceMomentumIndicator;

  })(Indicator);

  module.exports = PriceMomentumIndicator;

}).call(this);
