(function() {
  var Indicator, PbRatioIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Indicator = require('../indicator.js');

  PbRatioIndicator = (function(_super) {

    __extends(PbRatioIndicator, _super);

    function PbRatioIndicator(equity, index) {
      this.equity = equity;
      this.index = index;
      this.calculate = __bind(this.calculate, this);

    }

    PbRatioIndicator.prototype.calculate = function() {
      var val;
      val = this.equity.latestFacts.pbRatio;
      if (val === null) {
        return new Error;
      }
      if (val < 0.6) {
        return 2;
      }
      if (val < 0.9) {
        return 1;
      }
      if (val < 1.3) {
        return 0;
      }
      return -1;
    };

    return PbRatioIndicator;

  })(Indicator);

  module.exports = PbRatioIndicator;

}).call(this);
