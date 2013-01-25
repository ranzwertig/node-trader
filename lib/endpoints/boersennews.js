(function() {
  var BoersennewsEndpoint, Crawler, Endpoint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Endpoint = require('../endpoint.js');

  Crawler = require('crawler').Crawler;

  /*
  Fetch stock data from boersennews.de
  
  Attention: This endpoint returns all facts in currency EUR!
  */


  BoersennewsEndpoint = (function(_super) {

    __extends(BoersennewsEndpoint, _super);

    function BoersennewsEndpoint(cache) {
      this.cache = cache != null ? cache : null;
      this.baseUrl = 'http://www.boersennews.de';
      this.crawler = new Crawler({
        forceUTF8: true,
        maxConnections: 10,
        cache: true
      });
    }

    /*
        Retrieve a single equity by ISIN
    */


    BoersennewsEndpoint.prototype.getEquityByIsin = function(isin, cb) {
      var url,
        _this = this;
      isin = isin.toLowerCase();
      url = 'http://www.boersennews.de/markt/search/simple/key/' + encodeURIComponent(isin) + '/category/sto';
      this.crawler.queue([
        {
          uri: url,
          callback: function(error, result, $) {
            var row, tds, _i, _len, _ref;
            if (error) {
              cb(new Error('Could not load boersennews.de!'), null);
              return;
            }
            url = null;
            _ref = $('table.tabList.lastLine tr:has(td)');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              row = _ref[_i];
              tds = $(row).find('td');
              if ($(tds[2]).text().toLowerCase() === isin) {
                url = _this.baseUrl + $(tds[0]).find('a').attr('href').replace("/profile", "/fundamental");
                break;
              }
            }
            if (!url) {
              cb(null, null);
              return;
            }
            return _this.crawlEquity(url, cb);
          }
        }
      ]);
      return this;
    };

    /*
        Crawl an equity by its URL on boersennews.de
        This methods crawls only stock facts page.
    
        @param {String} url URL of an equity "Fundamentale Daten" page on boersennews.de
        @param {Function} cb Callback is called with Error|null and Object, the crawled equity
    */


    BoersennewsEndpoint.prototype.crawlEquity = function(url, cb) {
      var _this = this;
      this.crawler.queue([
        {
          uri: url,
          callback: function(error, result, $) {
            var col, cols, colsMap, equity, facts, factsPerYear, fillFacts, i, label, matches, obj, row, year, _i, _j, _len, _len1, _ref, _ref1;
            if (error) {
              cb(new Error('Could not load boersennews.de!'), null);
              return;
            }
            if (!_this._isValidEquityUrl(result.request.href)) {
              cb(new Error('Not a valid equity URL!'), null);
              return;
            }
            equity = {
              name: $('h2').text().replace(' Fundamentale Daten', '')
            };
            matches = /ISIN:\s([^\s]+)\s\|\sWKN:\s([^\s]+)/.exec($('.instrumentInfos h3').text());
            equity.isin = matches[1];
            equity.wkn = matches[2];
            colsMap = {};
            _ref = $('.tabList tr').eq(0).find('th');
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              col = _ref[i];
              if (/^\d+$/.test($(col).text())) {
                colsMap[$(col).text()] = i;
              }
            }
            factsPerYear = {};
            for (year in colsMap) {
              i = colsMap[year];
              factsPerYear[year] = {
                year: year
              };
            }
            fillFacts = function(cols, key) {
              var colIndex, num, _results;
              _results = [];
              for (year in colsMap) {
                colIndex = colsMap[year];
                matches = /([0-9,\.-]+)/.exec(cols.eq(colIndex).text());
                if (matches && matches[1] !== '-') {
                  num = parseFloat(matches[1].replace('.', '').replace(',', '.'));
                  _results.push(factsPerYear[year][key] = num);
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            };
            _ref1 = $('.tabList tr:has(td)');
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              row = _ref1[_j];
              cols = $(row).find('td');
              label = cols.eq(0).text();
              if (/^\s*Marktkapitalisierung\/EBITDA/.test(label)) {
                fillFacts(cols, 'marketCapPerEbitda');
                continue;
              }
              if (/^\s*KGV/.test(label)) {
                fillFacts(cols, 'peRatio');
                continue;
              }
              if (/^\s*KBV/.test(label)) {
                fillFacts(cols, 'pbRatio');
                continue;
              }
              if (/^\s*Dividende je Aktie/.test(label)) {
                fillFacts(cols, 'dividendPerShare');
                continue;
              }
              if (/^\s*Eigenkapitalrendite/.test(label)) {
                fillFacts(cols, 'returnOfEquity');
                continue;
              }
              if (/^\s*Eigenkapitalquote/.test(label)) {
                fillFacts(cols, 'equityRatio');
                continue;
              }
              if (/^\s*EBIT-Marge/.test(label)) {
                fillFacts(cols, 'ebitMargin');
                continue;
              }
              if (/^\s*EBITDA-Marge/.test(label)) {
                fillFacts(cols, 'ebitdaMargin');
                continue;
              }
              if (/^\s*Ergebnis je Aktie/.test(label)) {
                fillFacts(cols, 'earningsPerShare');
                continue;
              }
              if (/^\s*Dynamisches KGV/.test(label)) {
                fillFacts(cols, 'dynamicPeRatio');
                continue;
              }
              if (/^\s*Cashflow je Aktie/.test(label)) {
                fillFacts(cols, 'cashflowPerShare');
                continue;
              }
              if (/^\s*KCV/.test(label)) {
                fillFacts(cols, 'pcfRatio');
                continue;
              }
              if (/^\s*KUV/.test(label)) {
                fillFacts(cols, 'psRatio');
                continue;
              }
              if (/^\s*Marktkapitalisierung je Mitarbeiter/.test(label)) {
                fillFacts(cols, 'marketCapPerEmployee');
                continue;
              }
              if (/^\s*Gewinnwachstum/.test(label)) {
                fillFacts(cols, 'profitGrowth');
                continue;
              }
              if (/^\s*Umsatzwachstum/.test(label)) {
                fillFacts(cols, 'salesGrowth');
                continue;
              }
              if (/^\s*Dividendenrendite/.test(label)) {
                fillFacts(cols, 'dividendYield');
                continue;
              }
              if (/^\s*Brutto-Umsatzrendite/.test(label)) {
                fillFacts(cols, 'returnOnSales');
                continue;
              }
              if (/^\s*Anzahl Mitarbeiter/.test(label)) {
                fillFacts(cols, 'employees');
                continue;
              }
              if (/^\s*Umsatz je Mitarbeiter/.test(label)) {
                fillFacts(cols, 'salesPerEmployee');
                continue;
              }
              if (/^\s*Cashflow-Marge/.test(label)) {
                fillFacts(cols, 'cashflowMargin');
                continue;
              }
              if (/^\s*Verschuldungsgrad/.test(label)) {
                fillFacts(cols, 'debtEquityRatio');
                continue;
              }
              if (/^\s*Dynamischer Verschuldungsgrad/.test(label)) {
                fillFacts(cols, 'dynamicDebtEquityRatio');
                continue;
              }
              if (/^\s*CFROI/.test(label)) {
                fillFacts(cols, 'cfroi');
                continue;
              }
            }
            for (i in factsPerYear) {
              obj = factsPerYear[i];
              if (obj.marketCapPerEmployee !== null && obj.employees !== null) {
                obj.marketCap = obj.marketCapPerEmployee * obj.employees;
              }
              if (obj.salesPerEmployee !== null && obj.employees !== null) {
                obj.sales = obj.salesPerEmployee * obj.employees;
              }
            }
            facts = [];
            for (i in factsPerYear) {
              obj = factsPerYear[i];
              delete obj.marketCapPerEmployee;
              delete obj.salesPerEmployee;
              facts.push(obj);
            }
            facts.sort(function(a, b) {
              return b.year - a.year;
            });
            equity.latestFacts = facts.shift();
            equity.historicFacts = facts;
            return cb(null, equity);
          }
        }
      ]);
      return this;
    };

    BoersennewsEndpoint.prototype._isValidEquityUrl = function(url) {
      return /^http:\/\/www\.boersennews\.de\/markt\/aktien\/[^\/]+\/[^\/]+\/fundamental$/.test(url);
    };

    return BoersennewsEndpoint;

  })(Endpoint);

  module.exports = BoersennewsEndpoint;

}).call(this);
