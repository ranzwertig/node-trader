(function() {
  var Indicator, PeRatioMeanIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  PeRatioMeanIndicator = (function(_super) {

    __extends(PeRatioMeanIndicator, _super);

    function PeRatioMeanIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    PeRatioMeanIndicator.prototype.calculate = function() {
      var facts, i, numYears, val, _i, _len, _ref;
      numYears = 5;
      val = 0;
      if (this.equity.latestFacts.peRatio === null) {
        return new Error;
      } else {
        val += this.equity.latestFacts.peRatio;
      }
      if (!this.equity.historicFacts || this.equity.historicFacts.length < numYears - 1) {
        return new Error;
      }
      _ref = this.equity.historicFacts;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        facts = _ref[i];
        if (i === numYears - 1) {
          break;
        }
        if (facts.peRatio === null) {
          return new Error;
        }
        val += facts.peRatio;
      }
      val /= numYears;
      if (val < 12) {
        return 1;
      }
      if (val > 16) {
        return -1;
      }
      return 0;
    };

    return PeRatioMeanIndicator;

  })(Indicator);

  module.exports = PeRatioMeanIndicator;

}).call(this);
