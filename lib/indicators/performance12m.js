(function() {
  var Indicator, Performance12MIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  Performance12MIndicator = (function(_super) {

    __extends(Performance12MIndicator, _super);

    function Performance12MIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    Performance12MIndicator.prototype.calculate = function() {
      var ratio;
      if (!this.equity.latestPrice || !this.equity.monthlyPrices || this.equity.monthlyPrices.length < 12) {
        return new Error;
      }
      ratio = this.equity.latestPrice / this.equity.monthlyPrices[11];
      if (ratio > 1.05) {
        return 1;
      }
      if (ratio < 0.95) {
        return -1;
      }
      return 0;
    };

    return Performance12MIndicator;

  })(Indicator);

  module.exports = Performance12MIndicator;

}).call(this);
