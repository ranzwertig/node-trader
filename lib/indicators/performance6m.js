(function() {
  var Indicator, Performance6MIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  Performance6MIndicator = (function(_super) {

    __extends(Performance6MIndicator, _super);

    function Performance6MIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    Performance6MIndicator.prototype.calculate = function() {
      var ratio;
      if (!this.equity.latestPrice || !this.equity.monthlyPrices || this.equity.monthlyPrices.length < 6) {
        return new Error;
      }
      ratio = this.equity.latestPrice / this.equity.monthlyPrices[5];
      if (ratio > 1.05) {
        return 1;
      }
      if (ratio < 0.95) {
        return -1;
      }
      return 0;
    };

    return Performance6MIndicator;

  })(Indicator);

  module.exports = Performance6MIndicator;

}).call(this);
