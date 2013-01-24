(function() {
  var Indicator, IsLargeCapIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  IsLargeCapIndicator = (function(_super) {

    __extends(IsLargeCapIndicator, _super);

    function IsLargeCapIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    IsLargeCapIndicator.prototype.calculate = function() {
      if (this.equity.latestFacts.marketCap === null) {
        return false;
      }
      return this.equity.latestFacts.marketCap > (5 * Math.pow(10, 9));
    };

    return IsLargeCapIndicator;

  })(Indicator);

  module.exports = IsLargeCapIndicator;

}).call(this);
