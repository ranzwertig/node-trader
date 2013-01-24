(function() {
  var CustomRating, Endpoint, Indicator, Rating,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Rating = require('../rating.js');

  Indicator = require('../indicator.js');

  Endpoint = require('../endpoint.js');

  /*
  Compute scores according custom pre defined indicators weightened by given weights
  
  > trader -i jsonfile:dax.json -o table -r custom:DAX:ebitmargin,1:equityratio,1:pbratio,1:peratiomean,1:performance12m,1:performance6m,1:pricemomentum,1:prratio,1:returnofequity,1:threemonthreversal,1
  */


  CustomRating = (function(_super) {

    __extends(CustomRating, _super);

    /*
        @param {String} indexName Name of the index used for perfomance comparison, uses search on finanzen.net to find the actual index
        @param {array} indicatorsAndWeightsArray everything after custom:INDEX: defining the indicators and weights, formated like e.g. custom:DAX:ReturnOfEquity,1:EbitMargin:2
    */


    function CustomRating() {
      var indexName, indicator, indicatorsAndWeightsArray, pair, weight, _i, _len, _ref;
      indexName = arguments[0], indicatorsAndWeightsArray = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.indexName = indexName;
      this.getRating = __bind(this.getRating, this);

      this.finanzennetEndpoint = Endpoint.create('finanzennet');
      this.indicatorsAndWeights = {};
      for (_i = 0, _len = indicatorsAndWeightsArray.length; _i < _len; _i++) {
        pair = indicatorsAndWeightsArray[_i];
        try {
          _ref = pair.split(','), indicator = _ref[0], weight = _ref[1];
        } catch (err) {
          throw new Error('Invalid indicator and weight definition.');
        }
        this.indicatorsAndWeights[indicator] = weight;
      }
    }

    /*
        Compute the rating for a list of equities.
    
        callback is called with Error|null and Object of the form:
        {
            [isin]: {
                score: Some float or integer, the higher the better
                certainty: 0-1 (a percentage) This value is equal to 1 if no value necessary for the rating process was missing. Therefore it gives the percentage of necessary equity facts which were available.
            }
            ...
        }
    */


    CustomRating.prototype.getRating = function(equities, cb) {
      var _this = this;
      this.finanzennetEndpoint.searchIndex(this.indexName, function(err, index) {
        var equity, indicatorName, ratings, score, scores, totalErrors, totalScore, _i, _j, _len, _len1;
        if (err) {
          cb(err, null);
          return;
        }
        ratings = {};
        for (_i = 0, _len = equities.length; _i < _len; _i++) {
          equity = equities[_i];
          totalScore = 0;
          totalErrors = 0;
          scores = [];
          for (indicatorName in _this.indicatorsAndWeights) {
            try {
              score = Indicator.create(indicatorName, equity, index).calculate();
            } catch (err) {
              cb(new Error('error calculating indicator ' + indicatorName), null);
            }
            if (score instanceof Error) {
              scores.push(score);
            } else {
              scores.push(score * parseFloat(_this.indicatorsAndWeights[indicatorName]));
            }
          }
          for (_j = 0, _len1 = scores.length; _j < _len1; _j++) {
            score = scores[_j];
            if (score instanceof Error) {
              totalErrors++;
            } else {
              totalScore += score;
            }
          }
          ratings[equity.isin] = {
            score: totalScore,
            certainty: (scores.length - totalErrors) / scores.length
          };
        }
        return cb(null, ratings);
      });
      return this;
    };

    return CustomRating;

  })(Rating);

  module.exports = CustomRating;

}).call(this);
