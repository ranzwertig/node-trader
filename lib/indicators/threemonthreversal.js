(function() {
  var Indicator, TreeMonthReversalIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  TreeMonthReversalIndicator = (function(_super) {

    __extends(TreeMonthReversalIndicator, _super);

    function TreeMonthReversalIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    TreeMonthReversalIndicator.prototype.calculate = function() {
      var equityPerformance, i, indexPerformance, less, more, numMonths, _i, _ref;
      if (!Indicator.create('isLargeCap', this.equity, this.index).calculate()) {
        return 0;
      }
      if (!this.equity.monthlyPrices || this.equity.monthlyPrices.length < numMonths + 1) {
        return new Error;
      }
      if (!this.index.monthlyPrices || this.index.monthlyPrices.length < numMonths + 1) {
        return new Error;
      }
      numMonths = 3;
      more = 0;
      less = 0;
      for (i = _i = 0, _ref = numMonths - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        equityPerformance = this.equity.monthlyPrices[i] / this.equity.monthlyPrices[i + 1];
        indexPerformance = this.index.monthlyPrices[i] / this.index.monthlyPrices[i + 1];
        if (equityPerformance < indexPerformance) {
          less++;
        } else if (equityPerformance > indexPerformance) {
          more++;
        }
      }
      if (less === numMonths) {
        return 1;
      }
      if (more === numMonths) {
        return -1;
      }
      return 0;
    };

    return TreeMonthReversalIndicator;

  })(Indicator);

  module.exports = TreeMonthReversalIndicator;

}).call(this);
