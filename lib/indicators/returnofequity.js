(function() {
  var Indicator, ReturnOfEquityIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  ReturnOfEquityIndicator = (function(_super) {

    __extends(ReturnOfEquityIndicator, _super);

    function ReturnOfEquityIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    ReturnOfEquityIndicator.prototype.calculate = function() {
      var val;
      val = this.equity.latestFacts.returnOfEquity;
      if (val === null) {
        return new Error;
      }
      if (val > 20) {
        return 1;
      }
      if (val < 10) {
        return -1;
      }
      return 0;
    };

    return ReturnOfEquityIndicator;

  })(Indicator);

  module.exports = ReturnOfEquityIndicator;

}).call(this);
